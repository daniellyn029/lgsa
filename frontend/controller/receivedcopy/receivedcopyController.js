app.controller('receivedcopyController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/receivedcopy/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/receivedcopy/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/receivedcopy/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.receivedcopy = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            receivedcopyInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.receivedcopy.values.accountid,
                'accountuserid': $scope.receivedcopy.values.accountuserid,
                'accounttype': $scope.receivedcopy.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('receivedcopySpinner');     
                if(result.status=='error'){
					$scope.receivedcopy.values.receivedcopyInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.receivedcopy.values.receivedcopyInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.receivedcopy.values.receivedcopyInformation = result.data;
                    //console.log($scope.payroll.values.payrollInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('receivedcopySpinner');
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
            'accountuserid': $scope.receivedcopy.values.accountuserid,
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
    $scope.receivedcopy123 = function(){
        spinnerService.show('receivedcopySpinner');
        var received_copy = this; // list Voucher
        $scope.received_copy = received_copy;
        received_copy.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'receivedcopy/receivedcopyList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.receivedcopy.values.accountid,
                o.accountuserid = $scope.receivedcopy.values.accountuserid,
                o.accounttype = $scope.receivedcopy.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Received Copy',
                className: 'dt-button-addReceivedCopy',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addReceivedCopy").attr({'data-target':'#addReceivedCopy','data-toggle':'modal','onclick':'angular.element(this).scope().add_received_copy_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        received_copy.dtOptions.drawCallback = function() {
            $(".dt-button-addReceivedCopy").attr({'data-target':'#addReceivedCopy','data-toggle':'modal','onclick':'angular.element(this).scope().add_received_copy_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };

        received_copy.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('employee_name').withTitle('Guard Name').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Posting Area').notSortable(),
            DTColumnBuilder.newColumn('date_issued').withTitle('Date Issued').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Status').notSortable()
            .renderWith(function(data, type, full, meta){
                return '<span class="'+data.account_icon+'">'+' '+data.status+'</span>';
            })

            
        ];
        
        received_copy.dtInstance16 = {};
        //Datatables end



    }




}]);