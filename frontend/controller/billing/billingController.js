app.controller('billingController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/billing/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/billing/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/billing/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.billing = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            billingInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.billing.values.accountid,
                'accountuserid': $scope.billing.values.accountuserid,
                'accounttype': $scope.billing.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('billingSpinner');     
                if(result.status=='error'){
					$scope.billing.values.billingInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.billing.values.billingInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.billing.values.billingInformation = result.data;
                    //console.log($scope.payroll.values.payrollInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('billingSpinner');
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
            'accountuserid': $scope.billing.values.accountuserid,
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
    $scope.billing123 = function(){
        spinnerService.show('billingSpinner');
        var billing_dan = this; // list Voucher
        $scope.billing_dan = billing_dan;
        billing_dan.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'billing/billingList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.billing.values.accountid,
                o.accountuserid = $scope.billing.values.accountuserid,
                o.accounttype = $scope.billing.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Billing',
                className: 'dt-button-addBilling',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addBilling").attr({'data-target':'#addBilling','data-toggle':'modal','onclick':'angular.element(this).scope().add_billing_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        billing_dan.dtOptions.drawCallback = function() {
            $(".dt-button-addBilling").attr({'data-target':'#addBilling','data-toggle':'modal','onclick':'angular.element(this).scope().add_billing_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };

        billing_dan.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('control_id').withTitle('Billing No.').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Client Name').notSortable(),
            DTColumnBuilder.newColumn('date_issued').withTitle('Date Issued').notSortable(),
            DTColumnBuilder.newColumn('amount').withTitle('Amount').notSortable(),
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
                                        + '<li><a data-toggle="modal" data-target="#editBilling" onclick="angular.element(this).scope().viewBilling(\'' +data.billing_id+'\')"><i class="fa fa-pencil-square"></i> View / Edit</a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
            
        ];

        $("#billing123").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();
    
            // Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                clients_list.dtInstance3.dataTable.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            // console.log(clients_list.dtInstance3.dataTable);
        });

        
        billing_dan.dtInstance14 = {};
        //Datatables end

        // Add Billing View/delete input text
        $scope.add_billing_view = function () {
            var urlData = {
                'accountuserid': $scope.billing.values.accountuserid
            }
            $http.post(apiUrl + 'billing/emptyBillingView.php', urlData)
            .then(function (response, status) {

                // $scope.add_client_no = response.data.add_client_no;
                $scope.add_client_name_id = response.data.add_client_name_id;
                $scope.add_client_name = response.data.add_client_name;
                $scope.add_date_issued = response.data.add_date_issued;
                $scope.add_address = response.data.add_address;
                $scope.add_cp = response.data.add_cp;
                $scope.add_amount = response.data.add_amount;
                $scope.add_particulars = response.data.add_particulars;
                $scope.add_prepared_by_employee_id = response.data.add_prepared_by_employee_id;
                $scope.add_prepared_by_employee_name = response.data.add_prepared_by_employee_name;


            }, function (response) {
                $rootScope.modalDanger();
            });
        }

        //Add Billing 
        $scope.addBillingAccount = function(){

            $scope.isSaving = true;

            var urlData = {

                'accountuserid'                     :   $scope.billing.values.accountuserid,
                'add_client_name_id'                :   $scope.add_client_name_id,
                'add_client_name'                   :   $scope.add_client_name,
                'add_date_issued'                   :   $scope.add_date_issued,
                'add_address'                       :   $scope.add_address,
                'add_cp'                            :   $scope.add_cp,
                'add_amount'                        :   $scope.add_amount,
                'add_particulars'                   :   $scope.add_particulars,
                'add_prepared_by_employee_id'       :   $scope.add_prepared_by_employee_id,
                'add_prepared_by_employee_name'     :   $scope.add_prepared_by_employee_name,
                            
            }
            spinnerService.show('billingSpinner');
            $http.post(apiUrl+'billing/addBilling.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
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
                }else if(data.status=='nonam'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Client Name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nodatiss'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Date Issued!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noadd'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Contact Number!";
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
                }else if(data.status=='nopar'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Particulars!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='success'){
                    $("#addBilling").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Billing succesfully added!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");

                }
            },function(error){
                $rootScope.modalDanger();
            }).finally(function(){
                $timeout(function(){
                    $scope.isSaving = false;
                    //$("#custom_search_manila").modal("hide");
                    spinnerService.hide('billingSpinner');
                    billing_dan.dtInstance14.reloadData();
                }, 1000);
            });

        }

        // View Edit Billing
        $scope.viewBilling = function(billing_id){

            // When Update Request modal is OPEN//table wont compressed
            $('#editBilling').on('shown.bs.modal', function() {
                $("body").css("padding-right","");
            });

            var urlData = {
                'accountuserid': $scope.billing.values.accountuserid,
                'billing_id': billing_id
            }
            $http.post(apiUrl+'billing/editView.php', urlData)
            .then( function (response,status){ 

                $scope.edit_billing_id              = response.data.edit_billing_id;
                $scope.edit_client_name             = response.data.edit_client_name;
                $scope.edit_client_name_id          = response.data.edit_client_name_id;
                $scope.edit_date_issued             = response.data.edit_date_issued;
                $scope.edit_control_no             = response.data.edit_control_no;
                $scope.edit_address                 = response.data.edit_address;
                $scope.edit_cp                      = response.data.edit_cp;
                $scope.edit_amount                  = response.data.edit_amount;
                $scope.edit_particulars             = response.data.edit_particulars;
                $scope.edit_prepared_by_employee_id = response.data.edit_prepared_by_employee_id;
                $scope.edit_prepared_by_employee_name= response.data.edit_prepared_by_employee_name;

                $timeout(function () {
                    $("#select2-edit_client_name_id_text-container").text($scope.edit_client_name);
                }, 100);

            }, function(response) {
                $rootScope.modalDanger();
            });
        }
        
        //Client Information /ng-change
        $scope.clientInfo = function(){
            $timeout(function () {
                var urlData = {
                    'accountid': $scope.billing.values.accountid,
                    'client_name_id': $scope.add_client_name_id || $scope.edit_client_name_id,
                    
                }
                $http.post(apiUrl+'global/getClientInfo.php', urlData)
                .then(function(data, status){
                    //console.log(data);
                    // ng-model add billing modal
                    $scope.add_client_name = data.data.clientname;
                    $scope.add_address = data.data.address;
                    $scope.add_cp = data.data.contactnumber;
                    //ng-model edit billing modal
                    $scope.edit_client_name = data.data.clientname;
                    $scope.edit_address = data.data.address;
                    $scope.edit_cp = data.data.contactnumber;

                });
            }, 100);
        }

         //Edit Billing 
         $scope.editBillingAccount = function(){

            $scope.isSaving = true;

            var urlData = {

                'accountuserid'                     :   $scope.billing.values.accountuserid,
                'edit_billing_id'                   :   $scope.edit_billing_id,
                'edit_client_name_id'                :   $scope.edit_client_name_id,
                'edit_client_name'                   :   $scope.edit_client_name,
                'edit_date_issued'                   :   $scope.edit_date_issued,
                'edit_address'                       :   $scope.edit_address,
                'edit_cp'                            :   $scope.edit_cp,
                'edit_amount'                        :   $scope.edit_amount,
                'edit_particulars'                   :   $scope.edit_particulars,

                            
            }
            spinnerService.show('billingSpinner');
            $http.post(apiUrl+'billing/editBillingView.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
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
                }else if(data.status=='nonam'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Client Name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nodatiss'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Date Issued!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noadd'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Contact Number!";
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
                }else if(data.status=='nopar'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Particulars!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='success'){
                    $("#editBilling").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Billing succesfully updated!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");

                }
            },function(error){
                $rootScope.modalDanger();
            }).finally(function(){
                $timeout(function(){
                    $scope.isSaving = false;
                    //$("#custom_search_manila").modal("hide");
                    spinnerService.hide('billingSpinner');
                    billing_dan.dtInstance14.reloadData();
                }, 1000);
            });

        }




    }




}]);