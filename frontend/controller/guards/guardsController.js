app.controller('guardsController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/guards/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/guards/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/guards/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.guards = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            guardsInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.guards.values.accountid,
                'accountuserid': $scope.guards.values.accountuserid,
                'accounttype': $scope.guards.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('guardsSpinner');     
                if(result.status=='error'){
					$scope.guards.values.guardsInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.guards.values.guardsInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.guards.values.guardsInformation = result.data;
                    //console.log($scope.guards.values.guardsInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('guardsSpinner');
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
            'accountuserid': $scope.guards.values.accountuserid,
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
    $scope.guardsList = function(){
        spinnerService.show('guardsSpinner');
        var guards_list = this; // guards list
        $scope.guards_list = guards_list;
        guards_list.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'guards/guardsList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.guards.values.accountid,
                o.accountuserid = $scope.guards.values.accountuserid,
                o.accounttype = $scope.guards.values.accounttype
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
                text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Guard',
                className: 'dt-button-addGuard',
                action: function ( e, dt, node, config ) {
                    $(".dt-button-addGuard").attr({'data-target':'#addGuard','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
                }

            }
        ])
        guards_list.dtOptions.drawCallback = function() {
            $(".dt-button-addGuard").attr({'data-target':'#addGuard','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        };
        guards_list.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('guard_id').withTitle('Employee ID').notSortable(),
            DTColumnBuilder.newColumn(null).withTitle('Employee Name').notSortable()
            .renderWith(function(data, type, full, meta){
                var pic_fullName = "<div class='col-md-12'><span><img class='img-circle' alt='User Image' src='frontend/assets/images/profile_pic/"+data.profile_pic+"' width='30px' height='30px' onerror='this.src=\"frontend/assets/images/profile_pic/user-icon.png\"'></span></div><div>"+"<br/>"+data.name+"<br/></div>";

                return pic_fullName;
            }),
            DTColumnBuilder.newColumn('posting_area').withTitle('Posting Area').notSortable(),
            DTColumnBuilder.newColumn('date_hired').withTitle('Date Hired').notSortable(),
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
                                        + '<li><a data-toggle="modal" data-target="#editGuard" onclick="angular.element(this).scope().viewGuard(\'' +data.guard_id+'\')"><i class="fa fa-pencil-square"></i> View / Edit</a></li>'
                                        + '<li><a data-toggle="modal" data-target="#"><i class="fa fa-file-text"></i> Documents</a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
        ];

        $("#guardsList").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();
    
            // Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                guards_list.dtInstance2.dataTable.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            // console.log(guards_list.dtInstance2.dataTable);
        });
        
        guards_list.dtInstance2 = {};
        //Datatables end
        
        
        // Add Guard View/delete input text
        $scope.add_view = function () {
            var urlData = {
                'accountuserid': $scope.guards.values.accountuserid
            }
            $http.post(apiUrl + 'guards/emptyGuardView.php', urlData)
            .then(function (response, status) {

                $scope.add_picFile          = response.data.add_picFile;
                $scope.add_prof_pic         = response.data.add_prof_pic;
                $scope.add_employeeid       = response.data.add_employeeid;
                $scope.add_firstname        = response.data.add_firstname;
                $scope.add_middlename       = response.data.add_middlename;
                $scope.add_lastname         = response.data.add_lastname;
                $scope.add_suffix           = response.data.add_suffix;
                $scope.add_contactnumber    = response.data.add_contactnumber;
                $scope.add_present_address  = response.data.add_present_address;
                $scope.add_provincial_address = response.data.add_provincial_address;
                $scope.add_gender           = response.data.add_gender;
                $scope.add_birthdate        = response.data.add_birthdate;
                $scope.add_age              = response.data.add_age;
                $scope.add_birthplace       = response.data.add_birthplace;
                $scope.add_emergency        = response.data.add_emergency;
                $scope.add_relationship     = response.data.add_relationship;
                $scope.add_emeradd          = response.data.add_emeradd;
                $scope.add_emernum          = response.data.add_emernum;
                $scope.add_height           = response.data.add_height;
                $scope.add_weight           = response.data.add_weight;
                $scope.add_cpnum            = response.data.add_cpnum;
                $scope.add_civil_status     = response.data.add_civil_status;
                $scope.add_spouse           = response.data.add_spouse;
                $scope.add_spouse_add       = response.data.add_spouse_add;
                $scope.add_supported        = response.data.add_supported;
                $scope.add_supp_rel         = response.data.add_supp_rel;
                $scope.add_work_desire      = response.data.add_work_desire;
                $scope.add_sal_exp          = response.data.add_sal_exp;
                $scope.add_intro            = response.data.add_intro;
                $scope.add_hob_rec          = response.data.add_hob_rec;
                $scope.add_elem_scho        = response.data.add_elem_scho;
                $scope.add_elem_year        = response.data.add_elem_year;
                $scope.add_high_scho        = response.data.add_high_scho;
                $scope.add_high_year        = response.data.add_high_year;
                $scope.add_coll_scho        = response.data.add_coll_scho;
                $scope.add_coll_year        = response.data.add_coll_year;
                $scope.add_deg_scho         = response.data.add_deg_scho;
                $scope.add_deg_year         = response.data.add_deg_year;
                $scope.add_vo_scho          = response.data.add_vo_scho;
                $scope.add_vo_year          = response.data.add_vo_year;
                $scope.add_prev_emp         = response.data.add_prev_emp;
                $scope.add_prev_add         = response.data.add_prev_add;
                $scope.add_from             = response.data.add_from;
                $scope.add_to               = response.data.add_to;
                $scope.add_salar            = response.data.add_salar;
                $scope.add_work_done        = response.data.add_work_done;
                $scope.add_reas_leav        = response.data.add_reas_leav;
                $scope.add_sss              = response.data.add_sss;
                $scope.add_philhealth       = response.data.add_philhealth;
                $scope.add_pagibig          = response.data.add_pagibig;
                $scope.add_tax              = response.data.add_tax;
                $scope.add_date_hired       = response.data.add_date_hired;
                $scope.add_status           = response.data.add_status;
            }, function (response) {
                $rootScope.modalDanger();
            });
        }

        //Add Guard
        $scope.addaccountsave = function(add_picFile){    

            $scope.isSaving = true;

            // Previous Employment Salary
            if($scope.add_salar == '' || $scope.add_salar == null){
                $scope.add_salar = 0;
            }

            Upload.upload({
                url     : apiUrl+'guards/addguards.php',
                method  : 'POST',
                file    : add_picFile,
                data    :{
                    'accountuserid'          :  $scope.guards.values.accountuserid,
                    'add_picFile'            :   $scope.add_picFile,
                    'add_employeeid'         :   $scope.add_employeeid,
                    'add_firstname'          :   $scope.add_firstname,
                    'add_middlename'         :   $scope.add_middlename,
                    'add_lastname'           :   $scope.add_lastname,
                    'add_suffix'             :   $scope.add_suffix,
                    'add_present_address'    :   $scope.add_present_address,
                    'add_provincial_address' :   $scope.add_provincial_address,
                    'add_gender'             :   $scope.add_gender,
                    'add_birthdate'          :   $scope.add_birthdate,
                    'add_age'                :   $scope.add_age,
                    'add_birthplace'         :   $scope.add_birthplace,
                    'add_emergency'          :   $scope.add_emergency,
                    'add_relationship'       :   $scope.add_relationship,
                    'add_emeradd'            :   $scope.add_emeradd,
                    'add_emernum'            :   $scope.add_emernum,
                    'add_height'             :   $scope.add_height,
                    'add_weight'             :   $scope.add_weight,
                    'add_cpnum'              :   $scope.add_cpnum,
                    'add_civil_status'       :   $scope.add_civil_status,
                    'add_spouse'             :   $scope.add_spouse,
                    'add_spouse_add'         :   $scope.add_spouse_add,
                    'add_supported'          :   $scope.add_supported,
                    'add_supp_rel'           :   $scope.add_supp_rel,
                    'add_work_desire'        :   $scope.add_work_desire,
                    'add_sal_exp'            :   $scope.add_sal_exp,
                    'add_intro'              :   $scope.add_intro,
                    'add_hob_rec'            :   $scope.add_hob_rec,
                    'add_elem_scho'          :   $scope.add_elem_scho,
                    'add_elem_year'          :   $scope.add_elem_year,
                    'add_high_scho'          :   $scope.add_high_scho,
                    'add_high_year'          :   $scope.add_high_year,
                    'add_coll_scho'          :   $scope.add_coll_scho,
                    'add_coll_year'          :   $scope.add_coll_year,
                    'add_deg_scho'           :   $scope.add_deg_scho,
                    'add_deg_year'           :   $scope.add_deg_year,
                    'add_vo_scho'            :   $scope.add_vo_scho,
                    'add_vo_year'            :   $scope.add_vo_year,
                    'add_prev_emp'           :   $scope.add_prev_emp,
                    'add_prev_add'           :   $scope.add_prev_add,
                    'add_from'               :   $scope.add_from,
                    'add_to'                 :   $scope.add_to,
                    'add_salar'              :   $scope.add_salar,
                    'add_work_done'          :   $scope.add_work_done,
                    'add_reas_leav'          :   $scope.add_reas_leav,
                    'add_sss'                :   $scope.add_sss,
                    'add_philhealth'         :   $scope.add_philhealth,
                    'add_pagibig'            :   $scope.add_pagibig,
                    'add_tax'                :   $scope.add_tax,
                    'add_date_hired'         :   $scope.add_date_hired,
                    'add_status'             :   $scope.add_status,
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
                }else if(data.status=='noemployeeid'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No employee ID!";
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
                }else if(data.status=='nopresentaddress'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Present Address!";
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
                }else if(data.status=='nobirthdate'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Birthdate!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noage'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Age!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nobirthplace'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Birthplace!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemer'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Incase of Emergency Notify!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='norel'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Relationship!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemeradd'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemernum'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Cellphone Number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocpnum'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Cellphone Number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocivstat'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Civil Status!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noworkdes'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Work Desire!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nosalexp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Salary Expected!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nohobrec'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Favorite Hobbies and Recreation!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noelemscho'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Elementary School!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noelemyr'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Elementary Year Graduated!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nohsscho'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No High School!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nohsyr'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No High School Year Graduated!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='success'){
                    $("#addGuard").modal("hide");
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
                    spinnerService.hide('guardsSpinner');
                    guards_list.dtInstance2.reloadData();
                }, 1000);
            });

        }

        //Edit Guard View
        $scope.viewGuard = function(guard_id){

                // When Update Request modal is OPEN//table wont compressed
                $('#editGuard').on('shown.bs.modal', function() {
                $("body").css("padding-right","");
            });
            
            var urlData = {
                'accountuserid': $scope.guards.values.accountuserid,
                'guard_id': guard_id
            }
            $http.post(apiUrl+'guards/editView.php', urlData)
            .then( function (response,status){ 
                $scope.edit_picFile         = response.data.edit_picFile;
                $scope.edit_prof_pic        = response.data.edit_prof_pic;
                $scope.edit_id              = response.data.edit_id;
                $scope.edit_employeeid      = response.data.edit_employeeid;
                $scope.edit_client_name_id  = response.data.edit_client_name_id;
                $scope.edit_client_name     = response.data.edit_client_name;
                $scope.edit_firstname       = response.data.edit_firstname;
                $scope.edit_middlename      = response.data.edit_middlename;
                $scope.edit_lastname        = response.data.edit_lastname;
                $scope.edit_suffix          = response.data.edit_suffix;
                $scope.edit_contactnumber   = response.data.edit_contactnumber;
                $scope.edit_present_address = response.data.edit_present_address;
                $scope.edit_provincial_address = response.data.edit_provincial_address;
                $scope.edit_gender          = response.data.edit_gender;
                $scope.edit_birthdate       = response.data.edit_birthdate;
                $scope.edit_age             = response.data.edit_age;
                $scope.edit_birthplace      = response.data.edit_birthplace;
                $scope.edit_emergency       = response.data.edit_emergency;
                $scope.edit_relationship    = response.data.edit_relationship;
                $scope.edit_emeradd         = response.data.edit_emeradd;
                $scope.edit_emernum         = response.data.edit_emernum;
                $scope.edit_height          = response.data.edit_height;
                $scope.edit_weight          = response.data.edit_weight;
                $scope.edit_cpnum           = response.data.edit_cpnum;
                $scope.edit_civil_status    = response.data.edit_civil_status;
                $scope.edit_spouse          = response.data.edit_spouse;
                $scope.edit_spouse_add      = response.data.edit_spouse_add;
                $scope.edit_supported       = response.data.edit_supported;
                $scope.edit_supp_rel        = response.data.edit_supp_rel;
                $scope.edit_work_desire     = response.data.edit_work_desire;
                $scope.edit_sal_exp         = response.data.edit_sal_exp;
                $scope.edit_intro           = response.data.edit_intro;
                $scope.edit_hob_rec         = response.data.edit_hob_rec;
                $scope.edit_elem_scho       = response.data.edit_elem_scho;
                $scope.edit_elem_year       = response.data.edit_elem_year;
                $scope.edit_high_scho       = response.data.edit_high_scho;
                $scope.edit_high_year       = response.data.edit_high_year;
                $scope.edit_coll_scho       = response.data.edit_coll_scho;
                $scope.edit_coll_year       = response.data.edit_coll_year;
                $scope.edit_deg_scho        = response.data.edit_deg_scho;
                $scope.edit_deg_year        = response.data.edit_deg_year;
                $scope.edit_vo_scho         = response.data.edit_vo_scho;
                $scope.edit_vo_year         = response.data.edit_vo_year;
                $scope.edit_prev_emp        = response.data.edit_prev_emp;
                $scope.edit_prev_add        = response.data.edit_prev_add;
                $scope.edit_from            = response.data.edit_from;
                $scope.edit_to              = response.data.edit_to;
                $scope.edit_salar           = response.data.edit_salar;
                $scope.edit_work_done       = response.data.edit_work_done;
                $scope.edit_reas_leav       = response.data.edit_reas_leav;
                $scope.edit_sss             = response.data.edit_sss;
                $scope.edit_philhealth      = response.data.edit_philhealth;
                $scope.edit_pagibig         = response.data.edit_pagibig;
                $scope.edit_tax             = response.data.edit_tax;
                $scope.edit_date_hired      = response.data.edit_date_hired;
                $scope.edit_status          = response.data.edit_status;

                $timeout(function () {
                    $("#select2-edit_client_name_text-container").text($scope.edit_client_name);
                }, 100);


            }, function(response) {
                $rootScope.modalDanger();
            });
            
        }

        // Update Button WALA PA
        $scope.updateguard = function( file ){
            $scope.isSaving = true;
            Upload.upload({
                url     : apiUrl+'guards/editGuard.php',
                method  : 'POST',
                file    : file,
                data    : {
                    'accountuserid'           :  $scope.guards.values.accountuserid,
                    'edit_picFile'            :   $scope.edit_picFile,
                    'edit_id'                 :    $scope.edit_id,
                    'edit_employeeid'         :   $scope.edit_employeeid,
                    'edit_client_name_id'     :   $scope.edit_client_name_id,
                    'edit_client_name'        :   $scope.edit_client_name,
                    'edit_firstname'          :   $scope.edit_firstname,
                    'edit_middlename'         :   $scope.edit_middlename,
                    'edit_lastname'           :   $scope.edit_lastname,
                    'edit_suffix'             :   $scope.edit_suffix,
                    'edit_present_address'    :   $scope.edit_present_address,
                    'edit_provincial_address' :   $scope.edit_provincial_address,
                    'edit_gender'             :   $scope.edit_gender,
                    'edit_birthdate'          :   $scope.edit_birthdate,
                    'edit_age'                :   $scope.edit_age,
                    'edit_birthplace'         :   $scope.edit_birthplace,
                    'edit_emergency'          :   $scope.edit_emergency,
                    'edit_relationship'       :   $scope.edit_relationship,
                    'edit_emeradd'            :   $scope.edit_emeradd,
                    'edit_emernum'            :   $scope.edit_emernum,
                    'edit_height'             :   $scope.edit_height,
                    'edit_weight'             :   $scope.edit_weight,
                    'edit_cpnum'              :   $scope.edit_cpnum,
                    'edit_civil_status'       :   $scope.edit_civil_status,
                    'edit_spouse'             :   $scope.edit_spouse,
                    'edit_spouse_add'         :   $scope.edit_spouse_add,
                    'edit_supported'          :   $scope.edit_supported,
                    'edit_supp_rel'           :   $scope.edit_supp_rel,
                    'edit_work_desire'        :   $scope.edit_work_desire,
                    'edit_sal_exp'            :   $scope.edit_sal_exp,
                    'edit_intro'              :   $scope.edit_intro,
                    'edit_hob_rec'            :   $scope.edit_hob_rec,
                    'edit_elem_scho'          :   $scope.edit_elem_scho,
                    'edit_elem_year'          :   $scope.edit_elem_year,
                    'edit_high_scho'          :   $scope.edit_high_scho,
                    'edit_high_year'          :   $scope.edit_high_year,
                    'edit_coll_scho'          :   $scope.edit_coll_scho,
                    'edit_coll_year'          :   $scope.edit_coll_year,
                    'edit_deg_scho'           :   $scope.edit_deg_scho,
                    'edit_deg_year'           :   $scope.edit_deg_year,
                    'edit_vo_scho'            :   $scope.edit_vo_scho,
                    'edit_vo_year'            :   $scope.edit_vo_year,
                    'edit_prev_emp'           :   $scope.edit_prev_emp,
                    'edit_prev_add'           :   $scope.edit_prev_add,
                    'edit_from'               :   $scope.edit_from,
                    'edit_to'                 :   $scope.edit_to,
                    'edit_salar'              :   $scope.edit_salar,
                    'edit_work_done'          :   $scope.edit_work_done,
                    'edit_reas_leav'          :   $scope.edit_reas_leav,
                    'edit_sss'                :   $scope.edit_sss,
                    'edit_philhealth'         :   $scope.edit_philhealth,
                    'edit_pagibig'            :   $scope.edit_pagibig,
                    'edit_tax'                :   $scope.edit_tax,
                    'edit_status'             :   $scope.edit_status,
                    'edit_date_hired'         :   $scope.edit_date_hired,
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
                }else if(data.status=='noemployeeid'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No employee ID!";
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
                }else if(data.status=='nopresentaddress'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Present Address!";
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
                }else if(data.status=='nobirthdate'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Birthdate!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noage'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Age!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nobirthplace'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Birthplace!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemer'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Incase of Emergency Notify!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='norel'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Relationship!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemeradd'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Address!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noemernum'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Cellphone Number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocpnum'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Cellphone Number!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nocivstat'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Civil Status!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nosalexp'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Salary Expected!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='noelemscho'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No Elementary School!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='nohsscho'){
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-warning";
                    $rootScope.dymodaltitle= "Warning!";
                    $rootScope.dymodalmsg  = "No High School!";
                    $rootScope.dymodalstyle = "btn-warning";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    return;                
                }else if(data.status=='success'){
                    $("#editGuard").modal("hide");
                    $rootScope.dymodalstat = true;
                    $rootScope.dymodalclass = "alert alert-success";
                    $rootScope.dymodaltitle= "Success!";
                    $rootScope.dymodalmsg  = "Guard succesfully updated!";
                    $rootScope.dymodalstyle = "btn-success";
                    $rootScope.dymodalicon = "fa fa-exclamation-triangle";              
                    $("#dymodal").modal("show");
                    guards_list.dtInstance2.reloadData();
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