app.controller('accountsController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/accounts/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/accounts/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/accounts/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";
    
    // Info
    $scope.accounts = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            accountsInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.accounts.values.accountid,
                'accountuserid': $scope.accounts.values.accountuserid,
                'accounttype': $scope.accounts.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('accountsSpinner');     
                if(result.status=='error'){
					$scope.accounts.values.accountsInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.accounts.values.accountsInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.accounts.values.accountsInformation = result.data;
                    //console.log($scope.accounts.values.accountsInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('accountsSpinner');
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
            'accountuserid': $scope.accounts.values.accountuserid,
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
     $scope.userAccountList = function(){
        spinnerService.show('accountsSpinner');
        var accounts_list = this; // accounts list
        $scope.accounts_list = accounts_list;
        accounts_list.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'accounts/accountsList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.accounts.values.accountid,
                o.accountuserid = $scope.accounts.values.accountuserid,
                o.accounttype = $scope.accounts.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Account',
                className: 'dt-button-addAccount',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addAccount").attr({'data-target':'#addAccount','data-toggle':'modal','onclick':'angular.element(this).scope().add_user_account_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        accounts_list.dtOptions.drawCallback = function() {
            $(".dt-button-addAccount").attr({'data-target':'#addAccount','data-toggle':'modal','onclick':'angular.element(this).scope().add_user_account_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };
        accounts_list.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('employee_id').withTitle('Employee ID').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Account Name').notSortable()
            .renderWith(function(data, type, full, meta){
                var pic_fullName = "<div class='col-md-12'><span><img class='img-circle' alt='User Image' src='frontend/assets/images/profile_pic/"+data.profile_pic+"' width='30px' height='30px' onerror='this.src=\"frontend/assets/images/profile_pic/user-icon.png\"'></span></div><div>"+"<br/>"+data.account_name+"<br/></div>";

                return pic_fullName;
            }),
            DTColumnBuilder.newColumn('account_role').withTitle('Account Role').notSortable(),
            
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
                                        + '<li><a data-toggle="modal" data-target="#editUserAccount" onclick="angular.element(this).scope().viewUserAccount(\'' +data.employee_id+'\')"><i class="fa fa-pencil-square"></i> View / Edit</a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
        ];

        $("#userAccountList").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();
    
            // Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                accounts_list.dtInstance6.dataTable.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            // console.log(guards_list.dtInstance2.dataTable);
        });
        
        accounts_list.dtInstance6 = {};
        //Datatables end
        
         // Add User Account View/delete input text
         $scope.add_user_account_view = function () {
            var urlData = {
                'accountuserid': $scope.accounts.values.accountuserid
            }
            $http.post(apiUrl + 'accounts/emptyAccountView.php', urlData)
            .then(function (response, status) {

                $scope.add_picFile = response.data.add_picFile;
                $scope.add_prof_pic = response.data.add_prof_pic;
                $scope.add_employeeid123 = response.data.add_employeeid123;
                $scope.add_firstname = response.data.add_firstname;
                $scope.add_middlename = response.data.add_middlename;
                $scope.add_lastname = response.data.add_lastname;
                $scope.add_suffix = response.data.add_suffix;
                $scope.add_account_role = response.data.add_account_role;
                $scope.add_username = response.data.add_username;
                $scope.add_password = response.data.add_password;
                $scope.add_email_status = response.data.add_email_status;
                $scope.add_account_status = response.data.add_account_status;
                $scope.add_email_address = response.data.add_email_address;
                $scope.add_cp = response.data.add_cp;
                $scope.add_address = response.data.add_address;
                $scope.add_birthdate = response.data.add_birthdate;
                $scope.add_gender = response.data.add_gender;

            }, function (response) {
                $rootScope.modalDanger();
            });
        }

        //Add User Account
        $scope.addUserAccount = function(add_picFile){

            Upload.upload({
                url     : apiUrl+'accounts/addAccount.php',
                method  : 'POST',
                file    : add_picFile,
                data    :{
                    'accountuserid'          :  $scope.accounts.values.accountuserid,
                    'add_picFile'            :   $scope.add_picFile,
                    'add_employeeid123'      :   $scope.add_employeeid123,
                    'add_firstname'          :   $scope.add_firstname,
                    'add_middlename'         :   $scope.add_middlename,
                    'add_lastname'           :   $scope.add_lastname,
                    'add_suffix'             :   $scope.add_suffix,
                    'add_username'           :   $scope.add_username,
                    'add_password'           :   $scope.add_password,
                    'add_address'            :   $scope.add_address,
                    'add_cp'                 :   $scope.add_cp,
                    'add_email_address'      :   $scope.add_email_address,
                    'add_gender'             :   $scope.add_gender,
                    'add_birthdate'          :   $scope.add_birthdate,
                    'add_account_role'       :   $scope.add_account_role,
                    'add_account_status'     :   $scope.add_account_status,
                    'add_email_status'       :   $scope.add_email_status,
                    'add_suffix'             :   $scope.add_suffix,
                    'targetPath'             : '../../frontend/assets/images/profile_pic/'                            
                }
                
            }).then(function (response) {
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
                }else if(data.status=='error-upload-type'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Only png, jpg, and jpeg files are accepted!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;
                }else if(data.status=='noempid'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Employee ID!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noaccountrole'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Account Role!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nopassword'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Password!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nousername'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Username!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nofirstname'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Firstname!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nomiddlename'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Middlename!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nolastname'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Lastname!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemailstat'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Email Status!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noaccountrole'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Account Role!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Cellphone Number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noaddress'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nobday'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Birthdate!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemailadd'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Email Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nogender'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Gender!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noaccountstat'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Account Status!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='invalidemail'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "Invalid Email Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='success'){
                    $("#addAccount").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Sucess!";
                    $rootScope.dymodalmsg  = "Account succesfully added!";
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
                    spinnerService.hide('accountsSpinner');
                    accounts_list.dtInstance6.reloadData();
                }, 1000);
            });

        }
        
        //Edit View
        $scope.viewUserAccount = function(employee_id){

            // When Update Request modal is OPEN//table wont compressed
            $('#editUserAccount').on('shown.bs.modal', function() {
                $("body").css("padding-right","");
            });
            

            var urlData = {
                'accountuserid': $scope.accounts.values.accountuserid,
                'employee_id': employee_id
            }
            $http.post(apiUrl+'accounts/editView.php', urlData)
            .then( function (response,status){ 
                $scope.edit_picFile         = response.data.edit_picFile;
                $scope.edit_prof_pic        = response.data.edit_prof_pic;
                $scope.edit_id              = response.data.edit_id;
                $scope.edit_employeeid123   = response.data.edit_employeeid123;
                $scope.edit_firstname       = response.data.edit_firstname;
                $scope.edit_middlename      = response.data.edit_middlename;
                $scope.edit_lastname        = response.data.edit_lastname;
                $scope.edit_suffix          = response.data.edit_suffix;
                $scope.edit_username        = response.data.edit_username;
                $scope.edit_password        = response.data.edit_password;
                $scope.edit_suffix          = response.data.edit_suffix;
                $scope.edit_address         = response.data.edit_address;
                $scope.edit_cp              = response.data.edit_cp;
                $scope.edit_email_address   = response.data.edit_email_address;
                $scope.edit_gender          = response.data.edit_gender;
                $scope.edit_birthdate       = response.data.edit_birthdate;
                $scope.edit_account_role    = response.data.edit_account_role;
                $scope.edit_email_status    = response.data.edit_email_status;
                $scope.edit_account_status    = response.data.edit_account_status;



            }, function(response) {
                $rootScope.modalDanger();
            });
            
        }

        //Update Button WALA PA
        $scope.updateUserAccount = function( file ){
            $scope.isSaving = true;
            Upload.upload({
                url     : apiUrl+'accounts/editAccount.php',
                method  : 'POST',
                file    : file,
                data    : {
                    'accountuserid'           :   $scope.accounts.values.accountuserid,
                    'edit_picFile'            :   $scope.edit_picFile,   
                    'edit_prof_pic'           :   $scope.edit_prof_pic,
                    'edit_id'                 :   $scope.edit_id,
                    'edit_employeeid123'      :   $scope.edit_employeeid123,
                    'edit_firstname'          :   $scope.edit_firstname,  
                    'edit_middlename'         :   $scope.edit_middlename,  
                    'edit_lastname'           :   $scope.edit_lastname,  
                    'edit_suffix'             :   $scope.edit_suffix,   
                    'edit_username'           :   $scope.edit_username,    
                    'edit_password'           :   $scope.edit_password,     
                    'edit_address'            :   $scope.edit_address,     
                    'edit_cp'                 :   $scope.edit_cp,        
                    'edit_email_address'      :   $scope.edit_email_address,
                    'edit_gender'             :   $scope.edit_gender,  
                    'edit_birthdate'          :   $scope.edit_birthdate,
                    'edit_account_role'       :   $scope.edit_account_role,
                    'edit_email_status'       :   $scope.edit_email_status,   
                    'edit_account_status'     :   $scope.edit_account_status,  
                    'targetPath'              : '../../frontend/assets/images/profile_pic/' 
        
                                                
                }
                }).then(function (response) {
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
                    }else if(data.status=='error-upload-type'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Only png, jpg, and jpeg files are accepted!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;
                    }else if(data.status=='noempid123'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No employee ID!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nofir'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Firstname!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nomid'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Middlename!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nolast'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Middlename!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nouse'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Username!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nopas'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Password!";
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
                        $rootScope.dymodalmsg  = "No Cellphone Number!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nogen'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Gender!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='novalema'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "Invalid Email Address!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='nobirt'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Birthdate!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='noaccrol'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Account Role!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='noemastat'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Email Status!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='noaccstat'){
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-warning";
                        $rootScope.dymodaltitle= "Warning!";
                        $rootScope.dymodalmsg  = "No Account Status!";
                        $rootScope.dymodalstyle = "btn-warning";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        return;                
                    }else if(data.status=='success'){
                        $("#editUserAccount").modal("hide");
                        $rootScope.dymodalstat = true;
                        $rootScope.dymodalclass = "alert alert-success";
                        $rootScope.dymodaltitle= "Success!";
                        $rootScope.dymodalmsg  = "Account succesfully updated!";
                        $rootScope.dymodalstyle = "btn-success";
                        $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                        $("#dymodal").modal("show");
                        accounts_list.dtInstance6.reloadData();
                    }
                },  function (response) {
                        if (response.status > 0){
                            $rootScope.modalDanger();
                        }
                    }
                );
        }




    }


}]);