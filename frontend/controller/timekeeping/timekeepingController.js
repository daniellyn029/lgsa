app.controller('timekeepingController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/timekeeping/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/timekeeping/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/timekeeping/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.timekeeping = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            timekeepingInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.timekeeping.values.accountid,
                'accountuserid': $scope.timekeeping.values.accountuserid,
                'accounttype': $scope.timekeeping.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('timekeepingSpinner');     
                if(result.status=='error'){
					$scope.timekeeping.values.timekeepingInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.timekeeping.values.timekeepingInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.timekeeping.values.timekeepingInformation = result.data;
                    //console.log($scope.payroll.values.payrollInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('timekeepingSpinner');
                    $(".modal").modal('hide');
                    $(".modal-backdrop").remove();
                    $scope.loggedIn = true;
                }, 1000);
            });
        },
    }

    // Change Password
    $scope.params = {};

    $scope.showCurrentPassword = false; // Current Password
    $scope.showNewPassword = false; // New Password
    $scope.showConfirmPassword = false; // Confirm Password
    
    // Current Password 
    $scope.toggleShowCurrentPassword = function() {
        $scope.showCurrentPassword = !$scope.showCurrentPassword;
    }

    // New Password
    $scope.toggleShowNewPassword = function(){
        $scope.showNewPassword = !$scope.showNewPassword;
    }

    // Confirm Password
    $scope.toggleShowConfirmPassword = function(){
        $scope.showConfirmPassword = !$scope.showConfirmPassword;
    }

    // Change Password View
    $scope.changePasswordView = function(view){
        $scope.activePassword = null;
        $scope.activePassword = view.password;
    }

    // Change Password Close
    $scope.changePasswordClose = function(){
        $scope.params.currentPassword = null;
        $scope.params.newPassword = null;
        $scope.params.confirmPassword = null;
    }

    // Change Password Submit
    $scope.changePassword = function() {

        $scope.isSaving = true;

        var urlData = {
            'accountuserid': $scope.timekeeping.values.accountuserid,
            'oldpassword': $scope.activePassword,
            'confirmoldpassword': $scope.params.currentPassword,
            'newpassword': $scope.params.newPassword,
            'confirmpassword': $scope.params.confirmPassword
        }
        $http.post(apiUrl+'password/change_password.php', urlData)
        .then(function(result, status){
            var data = result.data;
            $scope.isSaving  = false;
            if(data.status == 'passworddidnotmatch'){
                $rootScope.dymodalstat = true;
                $rootScope.dymodalclass = "alert alert-warning";
                $rootScope.dymodaltitle= "Warning!";
                $rootScope.dymodalmsg  = "Password did not match.";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                $("#dymodal").modal("show");
                return;
            }else if(data.status == 'oldpassworddidnotmatch'){
                $rootScope.dymodalstat = true;
                $rootScope.dymodalclass = "alert alert-warning";
                $rootScope.dymodaltitle= "Warning!";
                $rootScope.dymodalmsg  = "Current password did not match.";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                $("#dymodal").modal("show");
                return;
            }else if(data.status == 'success'){
                spinnerService.show('changePasswordSpinner');
                $timeout(function () {
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Success!";
                    $rootScope.dymodalmsg  = "Password changed successfully.";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle"; 
                    spinnerService.hide('changePasswordSpinner');
                    $scope.loggedIn = true;
                    document.location.reload(true);             
                    $("#dymodal").modal("show");
                }, 1000);
            }else if(data.status == 'required'){
                $rootScope.dymodalstat = true;
                $rootScope.dymodalclass = "alert alert-warning";
                $rootScope.dymodaltitle= "Warning!";
                $rootScope.dymodalmsg  = "Some fields are required.";
                $rootScope.dymodalstyle = "btn-warning";
                $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                $("#dymodal").modal("show");
                return;
            }else{
                $rootScope.modalDanger();
            }
        }, function(response) {
            $rootScope.modalDanger();
        });
    }

   
    // Datatables
    $scope.timekeeping123 = function(){
        spinnerService.show('timekeepingSpinner');
        var timekeeping_dan = this; // list Voucher
        $scope.timekeeping_dan = timekeeping_dan;
        timekeeping_dan.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'timekeeping/timekeepingList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.timekeeping.values.accountid,
                o.accountuserid = $scope.timekeeping.values.accountuserid,
                o.accounttype = $scope.timekeeping.values.accounttype
            }
        })
        .withDataProp('data') // parameter name of list use in getLeads Function
        .withOption('bStateSave', true)
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('responsive', true)
        .withOption('autoWidth', false)
        .withOption('paging', true)
        .withOption('searching', {"regex": true})
        .withOption('lengthMenu',[[10, 25, 50, -1], [10, 25, 50, "All"]])
        .withOption('pageLength', 10)
        .withOption('order',[0,'asc'])
        .withPaginationType('full_numbers')
        .withOption('aaSorting',[0,'asc'])
        .withButtons([
            {
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Timekeeping',
                className: 'dt-button-addTimekeeping',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addTimekeeping").attr({'data-target':'#addTimekeeping','data-toggle':'modal','onclick':'angular.element(this).scope().add_timekeeping_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        timekeeping_dan.dtOptions.drawCallback = function() {
            $(".dt-button-addTimekeeping").attr({'data-target':'#addTimekeeping','data-toggle':'modal','onclick':'angular.element(this).scope().add_timekeeping_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };

        timekeeping_dan.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Client Name').notSortable(),
            DTColumnBuilder.newColumn('from').withTitle('Period Covered From').notSortable(),
            DTColumnBuilder.newColumn('to').withTitle('Period Covered To').notSortable(),
            DTColumnBuilder.newColumn('guard_inspector_name').withTitle('Guard Inspector Name').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Status').notSortable()
            .renderWith(function(data, type, full, meta){
                return '<span class="'+data.account_icon+'">'+' '+data.status+'</span>';
            })

            
        ];
        
        timekeeping_dan.dtInstance13 = {};
        //Datatables end

        // Add View
        $scope.add_timekeeping_view = function(){

            $rootScope.getAllEmployee(); // Get All Employee

            var urlData = {
                'accountuserid': $scope.timekeeping.values.accountuserid
            }
            $http.post(apiUrl+'timekeeping/addTimekeepingView.php',urlData)
            .then( function (response, status){	
                var data = response.data;
                $scope.entry = data;
                $scope.entry.tk.employee_id[0] = '';
                $scope.entry.tk.day_one[0] = '';
                $scope.entry.tk.day_two[0] = '';
                $scope.entry.tk.day_three[0] = '';
                $scope.entry.tk.day_four[0] = '';
                $scope.entry.tk.day_five[0] = '';
                $scope.entry.tk.day_six[0] = '';
                $scope.entry.tk.day_seven[0] = '';
                $scope.entry.tk.day_eight[0] = '';
                $scope.entry.tk.day_nine[0] = '';
                $scope.entry.tk.day_ten[0] = '';
                $scope.entry.tk.day_eleven[0] = '';
                $scope.entry.tk.day_twelve[0] = '';
                $scope.entry.tk.day_thirteen[0] = '';
                $scope.entry.tk.day_fourteen[0] = '';
                $scope.entry.tk.day_fifteen[0] = '';
                $scope.entry.tk.first_row_overtime[0] = '';
                $scope.entry.tk.first_row_hours[0] = '';
                $scope.entry.tk.first_row_no_of_days[0] = '';

                $scope.entry.tk.day_sixteen[0] = '';
                $scope.entry.tk.day_seventeen[0] = '';
                $scope.entry.tk.day_eighteen[0] = '';
                $scope.entry.tk.day_nineteen[0] = '';
                $scope.entry.tk.day_twenty[0] = '';
                $scope.entry.tk.day_twenty_one[0] = '';
                $scope.entry.tk.day_twenty_two[0] = '';
                $scope.entry.tk.day_twenty_three[0] = '';
                $scope.entry.tk.day_twenty_four[0] = '';
                $scope.entry.tk.day_twenty_five[0] = '';
                $scope.entry.tk.day_twenty_six[0] = '';
                $scope.entry.tk.day_twenty_seven[0] = '';
                $scope.entry.tk.day_twenty_eight[0] = '';
                $scope.entry.tk.day_twenty_nine[0] = '';
                $scope.entry.tk.day_thirty[0] = '';
                $scope.entry.tk.day_thirty_one[0] = '';
                $scope.entry.tk.day_overtime2[0] = '';
                $scope.entry.tk.second_row_hours[0] = '';
                $scope.entry.tk.second_row_days[0] = '';
                $scope.entry.tk.total_overtime[0] = '';
                $scope.entry.tk.total_work_hours[0] = '';
                $scope.entry.tk.total_no_days[0] = '';
                $timeout(function () {
					$('.item_tk_add').remove(); //Remove Class In Add Item
				}, 100);

            }, function(response) {
				$rootScope.modalDanger();
			});
        }

        // Add Save
        $scope.addTimeKeeping = function(){
            
            $scope.isSaving = true;

            if($scope.entry.day_one == 0 || $scope.entry.day_one == ''){
                $scope.entry.day_one = null;
            }

            var urlData = {
                'accountuserid': $scope.timekeeping.values.accountuserid,
                'accounttype': $scope.timekeeping.values.accounttype,
                'info': $scope.entry
            }
            console.log(urlData);
            // return;
            spinnerService.show('timekeepingSpinner');
            $http.post(apiUrl+'timekeeping/addTimeKeeping.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
                spinnerService.hide('timekeepingSpinner');
                if(data.status=='notloggedin'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "You are not logged in.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
					return;
                }else if(data.status=="error"){
					$rootScope.modalDanger();
                }else if(data.status == "noentrytk"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please complete the inputs in the timekeeping.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status == "noestablishment"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Select establishment.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status == "noperiodcoveredfrom"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Select period covered from.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status == "noperiodcoveredto"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Select period covered to.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status == "incorrectdaterange"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Period covered from must be lesser than period covered to.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status == "errortk"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Please complete details on timekeeping row number "+data.row+'.';
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status == "emptyinput"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
					$rootScope.dymodaltitle= "Warning!";
					$rootScope.dymodalmsg  = "Empty details on timekeeping fields.";
					$rootScope.dymodalstyle = "btn-warning";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    return;
                }else if(data.status=="success"){
                    $("#addTimekeeping").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
					$rootScope.dymodaltitle= "Success!";
					$rootScope.dymodalmsg  = "Timekeeping entry added successfully.";
					$rootScope.dymodalstyle = "btn-success";
					$rootScope.dymodalicon = "fa fa-exclamation-triangle";				
					$("#dymodal").modal("show");
                    timekeeping_dan.dtInstance13.DataTable.ajax.reload(null,false);
                }
            }, function(response){
				if (response.status > 0){
                    $rootScope.modalDanger();
                }
			});
        }



    }








}]);