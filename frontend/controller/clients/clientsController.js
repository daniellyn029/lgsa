app.controller('clientsController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/clients/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/clients/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/clients/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.clients = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            clientsInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.clients.values.accountid,
                'accountuserid': $scope.clients.values.accountuserid,
                'accounttype': $scope.clients.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('clientsSpinner');     
                if(result.status=='error'){
					$scope.clients.values.clientsInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.clients.values.clientsInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.clients.values.clientsInformation = result.data;
                    //console.log($scope.clients.values.clientsInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('clientsSpinner');
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
            'accountuserid': $scope.clients.values.accountuserid,
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
    $scope.clientsList = function(){
        spinnerService.show('clientsSpinner');
        var clients_list = this; // clients list
        $scope.clients_list = clients_list;
        clients_list.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'clients/clientsList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.clients.values.accountid,
                o.accountuserid = $scope.clients.values.accountuserid,
                o.accounttype = $scope.clients.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Client',
                className: 'dt-button-addClient',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addClient").attr({'data-target':'#addClient','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        clients_list.dtOptions.drawCallback = function() {
            $(".dt-button-addClient").attr({'data-target':'#addClient','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };
        clients_list.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Company Name').notSortable(),
            DTColumnBuilder.newColumn('client_address').withTitle('Address').notSortable(),
            DTColumnBuilder.newColumn('client_minimum_daily_rate').withTitle('Daily Rate').notSortable(),
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
                                        + '<li><a data-toggle="modal" data-target="#editClient" onclick="angular.element(this).scope().viewClient(\'' +data.client_id+'\')"><i class="fa fa-pencil-square"></i> View / Edit</a></li>'
                                        + '<li><a data-toggle="modal" data-target="#duty_detail_order" onclick="angular.element(this).scope().viewDutyDetailOrder(\'' +data.client_id+'\')"><i class="fa fa-info-circle"></i> Duty Detail Order</a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
        ];

        $("#clientsList").on('click', 'button, a', function (e) {
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

        clients_list.dtInstance3 = {};

        // Add Client View
        $scope.add_view = function(){

            $http.post(apiUrl + 'clients/addclientsview.php')
            .then(function (response, status) {
                $scope.add_company_name = response.data.add_company_name;
                $scope.add_contact_person = response.data.add_contact_person;
                $scope.add_contact_no = response.data.add_contact_no;
                $scope.add_email = response.data.add_email;
                $scope.add_company_address = response.data.add_company_address;
            }, function (response) {
                $rootScope.modalDanger();
            });

        }

        // Add Client
        $scope.addClient = function(){

            $scope.isSaving = true;

            var urlData = {
                'accountuserid': $scope.clients.values.accountuserid,
                'accounttype': $scope.clients.values.accounttype,
                'company_name': $scope.add_company_name,
                'contact_person': $scope.add_contact_person,
                'contact_no': $scope.add_contact_no,
                'email': $scope.add_email,
                'company_address': $scope.add_company_address
            }
            spinnerService.show('clientsSpinner');
            $http.post(apiUrl+'clients/addclients.php', urlData)
            .then(function(response){
                $scope.isSaving = false;
                spinnerService.hide('clientsSpinner');
                if(response.data.status == "error"){
                    $rootScope.modalDanger();
                }else if(response.data.status == "nocompanyname"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input company name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "nocontactperson"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input contact person!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "nocontact"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input contact number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "invalidemail"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Invalid email address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "noaddress"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "hasclient"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Company name already registered!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else{
                    $("#addClient").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle = "Success!";
                    $rootScope.dymodalmsg  = "Company successfully added!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-check";
                    $("#dymodal").modal("show");
                    clients_list.dtInstance3.DataTable.ajax.reload();
                }
            }, function(response){
				$rootScope.modalDanger();
			});
        }

        // View Client
        $scope.viewClient = function(client_id){
            var urlData = {
                'accountuserid': $scope.clients.values.accountuserid,
                'client_id': client_id
            }
            $http.post(apiUrl+'clients/viewClient.php', urlData)
            .then( function (response,status){ 
                $scope.prev_company_name = response.data.company_name;
                $scope.prev_status = response.data.status;
                $scope.prev_contact_person = response.data.contact_person;
                $scope.prev_contact_no = response.data.contact_no;
                $scope.prev_email = response.data.email;
                $scope.prev_daily_rate = response.data.daily_rate;
                $scope.prev_company_address = response.data.company_address;

                $scope.edit_company_id = response.data.company_id;
                $scope.edit_company_name = response.data.company_name;
                $scope.edit_status = response.data.status;
                $scope.edit_contact_person = response.data.contact_person;
                $scope.edit_contact_no = response.data.contact_no;
                $scope.edit_email = response.data.email;
                $scope.edit_company_address = response.data.company_address;

                $scope.prev_working_hours = response.data.working_hours;
                $scope.prev_minimum_daily_rate = response.data.minimum_daily_rate;
                $scope.prev_5_days_incentive = response.data._5_days_incentive;
                $scope.prev_13th_month_pay = response.data._13th_month_pay;
                $scope.prev_retirement_benefits = response.data.retirement_benefits;
                $scope.prev_uniform_allowance = response.data.uniform_allowance;
                $scope.prev_overtime = response.data.overtime;
                $scope.prev_night_differential = response.data.night_differential;
                $scope.prev_sss = response.data.sss;
                $scope.prev_philhealth = response.data.philhealth;
                $scope.prev_pagibig = response.data.pagibig;
                $scope.prev_others= response.data.others;

                $scope.working_hours = response.data.working_hours;
                $scope.minimum_daily_rate = response.data.minimum_daily_rate;
                $scope._5_days_incentive = response.data._5_days_incentive;
                $scope._13th_month_pay = response.data._13th_month_pay;
                $scope.retirement_benefits = response.data.retirement_benefits;
                $scope.uniform_allowance = response.data.uniform_allowance;
                $scope.overtime = response.data.overtime;
                $scope.night_differential = response.data.night_differential;
                $scope.sss = response.data.sss;
                $scope.philhealth = response.data.philhealth;
                $scope.pagibig = response.data.pagibig;
                $scope.others = response.data.others;

            }, function(response) {
                $rootScope.modalDanger();
            });
        }

        // Edit Client
        $scope.editClient = function(){

            $scope.isSaving = true;

            // Working Hours
            if($scope.working_hours=='' || $scope.working_hours==null){
                $scope.working_hours = 0;
            }
            // Minimum Daily Rate
            if($scope.minimum_daily_rate=='' || $scope.minimum_daily_rate==null){
                $scope.minimum_daily_rate = 0;
            }
            // 5 Days Incentive
            if($scope._5_days_incentive=='' || $scope._5_days_incentive==null){
                $scope._5_days_incentive = 0;
            }
            // 13th Month Pay
            if($scope._13th_month_pay=='' || $scope._13th_month_pay==null){
                $scope._13th_month_pay = 0;
            }
            // Retirement Benefits
            if($scope.retirement_benefits=='' || $scope.retirement_benefits==null){
                $scope.retirement_benefits = 0;
            }
            // Uniform Allowance
            if($scope.uniform_allowance=='' || $scope.uniform_allowance==null){
                $scope.uniform_allowance = 0;
            }
            // Overtime
            if($scope.uniform_allowance=='' || $scope.uniform_allowance==null){
                $scope.uniform_allowance = 0;
            }
            // Night Differential
            if($scope.night_differential=='' || $scope.night_differential==null){
                $scope.night_differential = 0;
            }
            // SSS
            if($scope.sss=='' || $scope.sss==null){
                $scope.sss = 0;
            }
            // Philhealth
            if($scope.philhealth=='' || $scope.philhealth==null){
                $scope.philhealth = 0;
            }
            // Pagibig
            if($scope.pagibig=='' || $scope.pagibig==null){
                $scope.pagibig = 0;
            }
            // Others
            if($scope.others=='' || $scope.others==null){
                $scope.others = 0;
            }


            var urlData = {
                'accountuserid'                                                 : $scope.clients.values.accountuserid,
                'accounttype'                                                   : $scope.clients.values.accounttype,
                'prev_company_name'                                             : $scope.prev_company_name,
                'prev_status'                                                   : $scope.prev_status,
                'prev_contact_person'                                           : $scope.prev_contact_person,
                'prev_contact_no'                                               : $scope.prev_contact_no,
                'prev_email'                                                    : $scope.prev_email,
                'prev_daily_rate'                                               : $scope.prev_daily_rate,
                'prev_company_address'                                          : $scope.prev_company_address,
                'company_id'                                                    : $scope.edit_company_id,
                'company_name'                                                  : $scope.edit_company_name,
                'status'                                                        : $scope.edit_status,
                'contact_person'                                                : $scope.edit_contact_person,
                'contact_no'                                                    : $scope.edit_contact_no,
                'email'                                                         : $scope.edit_email,
                'company_address'                                               : $scope.edit_company_address,

                'prev_working_hours'                                            : $scope.prev_working_hours,
                'prev_minimum_daily_rate'                                       : $scope.prev_minimum_daily_rate,
                'prev_5_days_incentive'                                         : $scope.prev_5_days_incentive,
                'prev_13th_month_pay'                                           : $scope.prev_13th_month_pay,
                'prev_retirement_benefits'                                      : $scope.prev_retirement_benefits,
                'prev_uniform_allowance'                                        : $scope.prev_uniform_allowance,
                'prev_overtime'                                                 : $scope.prev_overtime,
                'prev_night_differential'                                       : $scope.prev_night_differential,
                'prev_sss'                                                      : $scope.prev_sss,
                'prev_philhealth'                                               : $scope.prev_philhealth,
                'prev_pagibig'                                                  : $scope.prev_pagibig,
                'prev_others'                                                   : $scope.prev_others,

                'working_hours'												    : $scope.working_hours,
                'minimum_daily_rate'											: $scope.minimum_daily_rate,
                '_5_days_incentive'											    : $scope._5_days_incentive,
                '_13th_month_pay'												: $scope._13th_month_pay,
                'retirement_benefits'										    : $scope.retirement_benefits,
                'uniform_allowance'											    : $scope.uniform_allowance,
                'overtime'													    : $scope.overtime,
                'night_differential'											: $scope.night_differential,
                'sss'														    : $scope.sss,
                'philhealth'													: $scope.philhealth,
                'pagibig'													    : $scope.pagibig,
                'others'                                                        : $scope.others

            }
            spinnerService.show('clientsSpinner');
            $http.post(apiUrl+'clients/editClient.php', urlData)
            .then(function(response){
                $scope.isSaving = false;
                spinnerService.hide('clientsSpinner');
                if(response.data.status == "error"){
                    $rootScope.modalDanger();
                }else if(response.data.status == "nocompanyname"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input company name!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "nocontactperson"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input contact person!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "nocontact"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input contact number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "invalidemail"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Invalid email address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "noaddress"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Please input address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else if(response.data.status == "hasclient"){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Company name already registered!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";
                    $("#dymodal").modal("show");
                    return;
                }else{
                    $("#editClient").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle = "Success!";
                    $rootScope.dymodalmsg  = " <b>"+$scope.edit_company_name+"</b> successfully updated!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-check";
                    $("#dymodal").modal("show");
                    clients_list.dtInstance3.DataTable.ajax.reload(null,false);
                }
            }, function(response){
				$rootScope.modalDanger();
			});
        }

        // View Duty Detail Order
        $scope.viewDutyDetailOrder = function(){

            $rootScope.getAllEmployee(); // Get All Employee

            var urlData = {
                'accountid': $scope.clients.values.accountid,
                'accountuserid': $scope.clients.values.accountuserid
            }
            $http.post(apiUrl+'clients/viewDutyDetailOrder.php',urlData)
            .then( function (response, status){

                var data = response.data;
                $scope.entry = data;
   
                // Name, Place of Duty and Firearms issued view/delete input text
                $scope.entry.duty.ddo_employee[0] = '';
                $scope.entry.duty.ddo_place_of_duty[0] = '';	
                $scope.entry.duty.ddo_firearms_issued[0] = '';
                $timeout(function () {
                    $('.duty_detail_add').remove(); //Remove Class In Add Item
                }, 100);
            }, function(response) {
                $rootScope.modalDanger();
            });

        }


    }



}]);