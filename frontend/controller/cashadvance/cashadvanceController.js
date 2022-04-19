app.controller('cashadvanceController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/cashadvance/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/cashadvance/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/cashadvance/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.cashadvance = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            collectablesInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.cashadvance.values.accountid,
                'accountuserid': $scope.cashadvance.values.accountuserid,
                'accounttype': $scope.cashadvance.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('cashadvanceSpinner');     
                if(result.status=='error'){
					$scope.cashadvance.values.cashadvanceInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.cashadvance.values.cashadvanceInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.cashadvance.values.cashadvanceInformation = result.data;
                    //console.log($scope.cashadvance.values.cashadvanceInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('cashadvanceSpinner');
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
            'accountuserid': $scope.collectables.values.accountuserid,
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
    $scope.cashadvanceList = function(){
        spinnerService.show('cashadvanceSpinner');
        var cashadvance_list = this; // voucher list
        $scope.cashadvance_list = cashadvance_list;
        cashadvance_list.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'cashadvance/cashadvanceList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.cashadvance.values.accountid,
                o.accountuserid = $scope.cashadvance.values.accountuserid,
                o.accounttype = $scope.cashadvance.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add CA',
                className: 'dt-button-addCashAdvance',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addCashAdvance").attr({'data-target':'#addCashAdvance','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        cashadvance_list.dtOptions.drawCallback = function() {
            $(".dt-button-addCashAdvance").attr({'data-target':'#addCashAdvance','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };
        cashadvance_list.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('control_no').withTitle('Control No.').notSortable(),
            DTColumnBuilder.newColumn('guard_name').withTitle('Employee Name').notSortable(),
            DTColumnBuilder.newColumn('amount').withTitle('Amount').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Posting Area').notSortable(),
            DTColumnBuilder.newColumn('date_entered').withTitle('Date Requested').notSortable(),
            DTColumnBuilder.newColumn('prepared_by').withTitle('Prepared By').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Status').notSortable()
            .renderWith(function(data, type, full, meta){
                return '<span class="'+data.account_icon+'">'+' '+data.status+'</span>';
            }),
            DTColumnBuilder.newColumn(null).withTitle('ACTION').notSortable()
            .renderWith(function(data, type, full, meta){
                var action_elem = '';
                    action_elem += '<div class="dropdown">';
                    action_elem += '<button class="btn btn-flat btn-success dropdown-toggle btn-sm" type="button" data-toggle="dropdown" style="font-size:10px">Actions'
                                        +' <span class="caret"></span></button>'
                                        +'<ul class="dropdown-menu">'
                                        + '<li><a data-toggle="modal" data-target="#editCashAdvance" onclick="angular.element(this).scope().viewCashadvance(\'' +data.cashadvance_id+'\')"><i class="fa fa-pencil-square"></i> View / Edit</a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
        ];

        $("#cashadvanceList").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();
    
            // Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                cashadvance_list.dtInstance8.dataTable.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            // console.log(cashadvance_list.dtInstance8.dataTable);
        });

        cashadvance_list.dtInstance8 = {};


        // Add View CA//delete input text
        $scope.add_view = function(){

            $rootScope.getAllEmployee(); //Get all employee
    
            var urlData = {
                'accountid': $scope.cashadvance.values.accountid,
                'accountuserid': $scope.cashadvance.values.accountuserid,
            }
            $http.post(apiUrl+'cashadvance/addView.php',urlData)
            .then( function (response, status){
                var data = response.data;

                $scope.add_prepared_by_id       = response.data.add_prepared_by_id ;
                $scope.add_prepared_by_name     = response.data.add_prepared_by_name ;
                $scope.add_cashadvance_client_id= response.data.add_cashadvance_client_id ;
                $scope.add_cashadvance_client_name= response.data.add_cashadvance_client_name ;
                $scope.cashadvance_date         = response.data.cashadvance_date ;
                $scope.cashadvance_control_no   = response.data.cashadvance_control_no ;
                $scope.cashadvance_total         = response.data.cashadvance_total ;


                //Particular and Amount Add view/delete input text
                $scope.entry = data;
                $scope.entry.cashadvance.employee[0] = '';
                $scope.entry.cashadvance.amount[0] = '';	
                $timeout(function () {
                    $('.name_id_add').remove(); //Remove Class In Add Item
                }, 100);
            }, function(response) {
                $rootScope.modalDanger();
            });
        }

        // Add Cash Dvance
        $scope.addCashAdvance = function(){

            $scope.isSaving = true;

            var urlData = {
                'accountuserid'              : $scope.cashadvance.values.accountuserid,
                'add_cashadvance_client_id'  : $scope.add_cashadvance_client_id,
                'add_cashadvance_client_name': $scope.add_cashadvance_client_name,
                'cashadvance_date'           : $scope.cashadvance_date,
                'cashadvance_total'          : $scope.cashadvance_total,
                'add_prepared_by_id'         : $scope.add_prepared_by_id,
                'add_prepared_by_name'       : $scope.add_prepared_by_name,
                'info'                       : $scope.entry

            }
            spinnerService.show('cashadvanceSpinner');
            $http.post(apiUrl+'cashadvance/addCashAdvance.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
                spinnerService.hide('cashadvanceSpinner');
                if(data.status=='notloggedin'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "You are not logged in!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else if(data.status=='nocli'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Client Name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='nodat'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Date!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='noempamo'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Employee Name and Amount!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='noemp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Employee Name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='noamo'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Amount!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='success'){
                    $("#addCashAdvance").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Cash Advance succesfully added!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    
                }

            }, function(response){
                $rootScope.modalDanger();
            }).finally(function(){
                $timeout(function(){
                    $scope.isSaving = false;                    
                    spinnerService.hide('cashadvanceSpinner');
                    cashadvance_list.dtInstance8.reloadData();
                }, 1000);
            });
        }

        //Edit View
        $scope.viewCashadvance = function(cashadvance_id){

            // When Update Request modal is OPEN//table wont compressed
            $('#editCashAdvance').on('shown.bs.modal', function() {
                $("body").css("padding-right","");
            });


            $rootScope.getAllEmployee(); //Get all employee

            // $('.name_id_edit').remove();

            var urlData = {
                'accountuserid': $scope.cashadvance.values.accountuserid,
                'cashadvance_id': cashadvance_id
            }
            $http.post(apiUrl+'cashadvance/editView.php', urlData)
            .then( function (response,status){ 
                
                $scope.edit_cashadvance_id             = response.data.edit_cashadvance_id;
                $scope.cashadvance_client_edit_id      = response.data.cashadvance_client_edit_id;
                $scope.edit_cashadvance_client_name    = response.data.edit_cashadvance_client_name;
                $scope.edit_prepared_by_employee_id    = response.data.edit_prepared_by_employee_id;
                $scope.edit_prepared_by_name           = response.data.edit_prepared_by_name;
                $scope.cashadvance_date_edit           = response.data.cashadvance_date_edit;
                $scope.cashadvance_control_no          = response.data.cashadvance_control_no;

                $scope.cashadvance_employee_id         = response.data.cashadvance_employee_id;       
                $scope.cashadvance_employee_name       = response.data.cashadvance_name;          
                $scope.cashadvance_amount              = response.data.cashadvance_amount;          

                $scope.cashadvance_total_edit          = response.data.cashadvance_total_edit;

                // $scope.entry.cashadvance = [];
                // $scope.entry.cashadvance.employee_name = [];
                // $scope.entry.cashadvance.employee = [];
                // $scope.entry.cashadvance.amount = [];
                

                // if($scope.entry.get_cashadvance_employee==null){
                //     $scope.entry.cashadvance.employee_name[0] = '';
                //     $scope.entry.cashadvance.employee[0] = '';
                //     $scope.entry.cashadvance.amount[0] = '';
                // }else{
                //     $scope.entry.get_cashadvance_employee.forEach(function(item, index) {
                //         $scope.entry.cashadvance.employee[index] = item['cashadvance_employee_id'];
                //         $scope.entry.cashadvance.employee_name[index] = item['cashadvance_employee_name'];
                //         $scope.entry.cashadvance.amount[index] = item['amount'];
                        
                //     });   
                // }

                $timeout(function () {
                    $("#select2-edit_cashadvance_name_id_text-container").text($scope.edit_cashadvance_client_name);
                    $("#select2-edit_cashadvance_employee_name_id_text-container").text($scope.cashadvance_employee_name);
                }, 100);

                

            }, function(response) {
                $rootScope.modalDanger();
            });
            
        }

        
        // Edit Cash Advanced
        $scope.editCashAdvance = function(){

            $scope.isSaving = true;

            var urlData = {
                'accountuserid'                     : $scope.cashadvance.values.accountuserid,
                'edit_cashadvance_id'               : $scope.edit_cashadvance_id,
                'cashadvance_client_edit_id'        : $scope.cashadvance_client_edit_id,
                'edit_cashadvance_client_name'      : $scope.edit_cashadvance_client_name,
                'cashadvance_control_no'            : $scope.cashadvance_control_no,
                'cashadvance_date_edit'             : $scope.cashadvance_date_edit,
                'employee_name'                     : $scope.cashadvance_employee_name,
                'employee_id'                       : $scope.cashadvance_employee_id,
                'amount'                            : $scope.cashadvance_amount

            }
            spinnerService.show('cashadvanceSpinner');
            $http.post(apiUrl+'cashadvance/editCashAdvance.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
                spinnerService.hide('cashadvanceSpinner');
                if(data.status=='notloggedin'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "You are not logged in!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if( data.status == "error" ){
                    $rootScope.modalDanger();
                }else if(data.status=='noemp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Employee Name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='noamo'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Amount!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='success'){
                    $("#editCashAdvance").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Cash Advance succesfully updated!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    
                }

            }, function(response){
                $rootScope.modalDanger();
            }).finally(function(){
                $timeout(function(){
                    $scope.isSaving = false;                    
                    spinnerService.hide('cashadvanceSpinner');
                    cashadvance_list.dtInstance8.reloadData();
                }, 1000);
            });
        }


         //Calculate Amount Add
         $scope.calculate_amount = function(){
            //ng-model
            $scope.cashadvance_total=0;
            var regex=/^[-+]?\d*\.?\d*$/;
            var ndex = 0;
			$scope.entry.cashadvance.amount.forEach(function(item){
                item = (item != null ? ''+item: '0');
                if(!item.match(regex)){
                    $scope.entry.cashadvance.amount[ndex] = '';
                }else{
                    item = parseFloat((item > 0 ? item : 0))
                    $scope.cashadvance_total += item;
                }
                ndex++;
            });	
        }


    }



        

}]);

