app.controller('voucherController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/voucher/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/voucher/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/voucher/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.voucher = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            collectablesInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.voucher.values.accountid,
                'accountuserid': $scope.voucher.values.accountuserid,
                'accounttype': $scope.voucher.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('voucherSpinner');     
                if(result.status=='error'){
					$scope.voucher.values.voucherInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.voucher.values.voucherInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.voucher.values.voucherInformation = result.data;
                    //console.log($scope.voucher.values.voucherInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('voucherSpinner');
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
    $scope.voucherList = function(){
        spinnerService.show('voucherSpinner');
        var voucher_list = this; // voucher list
        $scope.voucher_list = voucher_list;
        voucher_list.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'voucher/voucherList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.voucher.values.accountid,
                o.accountuserid = $scope.voucher.values.accountuserid,
                o.accounttype = $scope.voucher.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Voucher',
                className: 'dt-button-addVoucher',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addVoucher").attr({'data-target':'#addVoucher','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        voucher_list.dtOptions.drawCallback = function() {
            $(".dt-button-addVoucher").attr({'data-target':'#addVoucher','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };
        voucher_list.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('control_no').withTitle('Control No.').notSortable(),
            DTColumnBuilder.newColumn('date_requested').withTitle('Date Requested').notSortable(),
            DTColumnBuilder.newColumn('payee').withTitle('Payee').notSortable(),
            DTColumnBuilder.newColumn('total').withTitle('Total').notSortable(),
            DTColumnBuilder.newColumn('prepared_by').withTitle('Prepared By').notSortable(),
            DTColumnBuilder.newColumn('approved_by').withTitle('Approved By').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Status').notSortable()
            .renderWith(function(data, type, full, meta){
                return '<span class="'+data.account_icon+'">'+' '+data.status+'</span>';
            }),
            DTColumnBuilder.newColumn(null).withTitle('ACTION').notSortable()
            .renderWith(function(data, type, full, meta){
                var action_elem = '';
                    action_elem += '<div class="dropdown">';
                    action_elem += '<button class="btn btn-flat btn-success dropdown-toggle btn-sm" type="button" data-toggle="dropdown" style="font-size:10px">Actions'
                                        + '<span class="caret"></span></button>'
                                        + '<ul class="dropdown-menu">'
                                        + '<li><a data-toggle="modal" data-target="#editVoucher" onclick="angular.element(this).scope().viewVoucher(\'' +data.voucher_id+'\')"><i class="fa fa-pencil-square"></i> View / Edit</a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
        ];

        $("#voucherList").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();
    
            // Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                voucher_list.dtInstance7.dataTable.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            // console.log(voucher_list.dtInstance7.dataTable);
        });

        voucher_list.dtInstance7 = {};


        // Add View Voucher/delete input text
        $scope.add_view = function(){

            var urlData = {
                'accountid': $scope.voucher.values.accountid,
                'accountuserid': $scope.voucher.values.accountuserid,
            }
            $http.post(apiUrl+'voucher/addView.php',urlData)
            .then( function (response, status){
                var data = response.data;
                $scope.entry = data;

                $scope.add_voucher_employee_id  = response.data.voucher_employee ;
                $scope.prepared_by_employee_id  = response.data.prepared_by_employee_id;
                $scope.prepared_by_employee_name= response.data.prepared_by_employee_name;
                $scope.voucher_date             = response.data.voucher_date ;
                // $scope.voucher_control_no       = response.data.voucher_control_no ;
                $scope.add_voucher_address      = response.data.voucher_address ;
                $scope.add_voucher_contact_no   = response.data.voucher_contact_no ;
                $scope.voucher_total            = response.data.voucher_total ;

                //Particular and Amount Add view/delete input text
                $scope.entry.voucher.particulars[0] = '';
                $scope.entry.voucher.amount[0] = '';	
                $timeout(function () {
                    $('.particular_id_add').remove(); //Remove Class In Add Item
                }, 100);
            }, function(response) {
                $rootScope.modalDanger();
            });
        }

        // Add Voucher
        $scope.addVoucher = function(){

            $scope.isSaving = true;

            var urlData = {
                'accountuserid'             : $scope.voucher.values.accountuserid,
                'prepared_by_employee_id'   : $scope.prepared_by_employee_id,
                'prepared_by_employee_name' : $scope.prepared_by_employee_name,
                'add_voucher_employee_name' : $scope.add_voucher_employee_name,
                'add_voucher_employee_id'   : $scope.add_voucher_employee_id,
                // 'voucher_control_no'        : $scope.voucher_control_no,
                'voucher_date'              : $scope.voucher_date,
                'add_voucher_address'       : $scope.add_voucher_address,
                'add_voucher_contact_no'    : $scope.add_voucher_contact_no,
                'voucher_total'             : $scope.voucher_total,
                'info'                      : $scope.entry

            }
            spinnerService.show('voucherSpinner');
            $http.post(apiUrl+'voucher/addVoucher.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
                spinnerService.hide('voucherSpinner');
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
                    $rootScope.dymodalmsg  = "No Payee!";
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
                }else if(data.status=='noparamo'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Particulars and Amount!";
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
                    $("#addVoucher").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Voucher succesfully added!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");

                }
            }, function(response){
                $rootScope.modalDanger();
            }).finally(function(){
                $timeout(function(){
                    $scope.isSaving = false;                    
                    spinnerService.hide('voucherSpinner');
                    voucher_list.dtInstance7.reloadData();
                }, 1000);
            });
        }

        //Display Text Voucher /Edit View
        $scope.viewVoucher = function(voucher_id){

            // When Update Request modal is OPEN//table wont compressed
            $('#editVoucher').on('shown.bs.modal', function() {
                $("body").css("padding-right","");
            });


            $('.particular_id_edit').remove();

            var urlData = {
                'accountuserid': $scope.voucher.values.accountuserid,
                'voucher_id': voucher_id
            }
            $http.post(apiUrl+'voucher/editView.php', urlData)
            .then( function (response,status){ 

                var data = response.data;
                $scope.entry = data[0];
                $scope.entry.voucher = [];

                $scope.edit_voucher_id                  = $scope.entry.edit_voucher_id;
                $scope.edit_prepared_by_employee_id     = $scope.entry.edit_prepared_by_employee_id;
                $scope.edit_prepared_by_employee_name   = $scope.entry.edit_prepared_by_employee_name;
                $scope.edit_voucher_employee_name       = $scope.entry.edit_voucher_employee_name;
                $scope.edit_voucher_employee_id         = $scope.entry.edit_voucher_employee_id;
                $scope.edit_voucher_date                = $scope.entry.edit_voucher_date;
                $scope.edit_voucher_control_no          = $scope.entry.edit_voucher_control_no;
                $scope.edit_voucher_contact_no          = $scope.entry.edit_voucher_contact_no;
                $scope.edit_voucher_address             = $scope.entry.edit_voucher_address;
                $scope.voucher_total_edit               = $scope.entry.voucher_total_edit;

                $scope.entry.voucher.particulars = [];
                $scope.entry.voucher.amount = [];
                
                if($scope.entry.get_voucher_particulars==null){
                    $scope.entry.voucher.particulars[0] = '';
                    $scope.entry.voucher.amount[0] = '';
                }else{
                    $scope.entry.get_voucher_particulars.forEach(function(item, index) {
                        $scope.entry.voucher.particulars[index] = item['particulars'];
                        $scope.entry.voucher.amount[index] = item['amount'];

                        
                    });   
                    
                }

                $timeout(function () {
                    $("#select2-edit_voucher_name_id_text-container").text($scope.edit_voucher_employee_name);
                }, 100);

             
                

            }, function(response) {
                $rootScope.modalDanger();
            });
            
        }


        // Edit Voucher
        $scope.editVoucher = function(){

            $scope.isSaving = true;

            var urlData = {
                'accountuserid'                 : $scope.voucher.values.accountuserid,
                'edit_voucher_id'               : $scope.edit_voucher_id,
                'edit_voucher_employee_name'    : $scope.edit_voucher_employee_name,
                'edit_voucher_employee_id'      : $scope.edit_voucher_employee_id,
                'edit_voucher_date'             : $scope.edit_voucher_date,
                'edit_voucher_control_no'       : $scope.edit_voucher_control_no,
                'edit_voucher_address'          : $scope.edit_voucher_address,
                'edit_voucher_contact_no'       : $scope.edit_voucher_contact_no,
                'voucher_total_edit'            : $scope.voucher_total_edit,
                'particulars'                   : $scope.entry.voucher.particulars,
                'amount'                        : $scope.entry.voucher.amount,
                'info'                          : $scope.entry                     

            }
            spinnerService.show('voucherSpinner');
            $http.post(apiUrl+'voucher/editVoucher.php', urlData)
            .then(function(response){
                var data = response.data;
                $scope.isSaving = false;
                spinnerService.hide('voucherSpinner');
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
                    $rootScope.dymodalmsg  = "No Payee!";
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
                }else if(data.status=='noparamo'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Particulars and Amount!";
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
                    $("#editVoucher").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Voucher succesfully updated!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    
                }
            }, function(response){
                $rootScope.modalDanger();
            }).finally(function(){
                $timeout(function(){
                    $scope.isSaving = false;                    
                    spinnerService.hide('voucherSpinner');
                    voucher_list.dtInstance7.reloadData();
                }, 1000);
            });
        }



        //Employee Info
        $scope.getEmployeeInfo = function(){
            $timeout(function () {
                var urlData = {
                    'accountid': $scope.voucher.values.accountid,
                    'employee_name_id': $scope.add_voucher_employee_id || $scope.edit_voucher_employee_id,
                    
                }
                $http.post(apiUrl+'global/getEmployeeInfo.php', urlData)
                .then(function(data, status){
                    //console.log(data);
                    // ng-model add billing modal
                    $scope.add_voucher_employee_name = data.data.fullname;
                    $scope.add_voucher_address = data.data.address;
                    $scope.add_voucher_contact_no = data.data.contactnumber;
                    //ng-model edit billing modal
                    $scope.edit_voucher_employee_name = data.data.fullname;
                    $scope.edit_voucher_address = data.data.address;
                    $scope.edit_voucher_contact_no = data.data.contactnumber;

                });
            }, 100);
        }

        //Calculate Amount Add
        $scope.calculate_amount = function(){

            $scope.voucher_total=0;
            var regex=/^[-+]?\d*\.?\d*$/;
            var ndex = 0;
			$scope.entry.voucher.amount.forEach(function(item){
                item = (item != null ? ''+item: '0');
                if(!item.match(regex)){
                    $scope.entry.voucher.amount[ndex] = '';
                }else{
                    item = parseFloat((item > 0 ? item : 0))
                    $scope.voucher_total += item;
                }
                ndex++;
            });	
        }


        //Calculate Amount Edit View
        $scope.calculate_amount_edit = function(){

            $scope.voucher_total_edit=0;
            var regex=/^[-+]?\d*\.?\d*$/;
            var ndex = 0;
            $scope.entry.voucher.amount.forEach(function(item){
                item = (item != null ? ''+item: '0');
                if(!item.match(regex)){
                    $scope.entry.voucher.amount[ndex] = '';
                }else{
                    item = parseFloat((item > 0 ? item : 0))
                    $scope.voucher_total_edit += item;
                }
                ndex++;
            });	
        }


        //Print 
        // $scope.printVoucher = function(control_no){

        //     alert(control_no);

        //     var urlData = {
        //         'accountuserid': $scope.voucher.values.accountuserid,
        //         'voucher_id': control_no
        //     }
        //     $http.post(apiUrl+'voucher/editView.php', urlData)
        //     .then(function(response, status){
        //         var data = response.data;
        //     }, function(response){
        //         $rootScope.modalDanger();
        //     });
        // }

    }



}]);