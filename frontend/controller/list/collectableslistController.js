app.controller('collectableslistController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/list/collectables/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/list/collectables/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/list/collectables/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.collectableslist = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            collectablesInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.collectableslist.values.accountid,
                'accountuserid': $scope.collectableslist.values.accountuserid,
                'accounttype': $scope.collectableslist.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('collectableslistSpinner');     
                if(result.status=='error'){
					$scope.collectableslist.values.collectableslistInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.collectableslist.values.collectableslistInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.collectableslist.values.collectableslistInformation = result.data;
                    //console.log($scope.collectableslist.values.collectableslistInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('collectableslistSpinner');
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
            'accountuserid': $scope.collectableslist.values.accountuserid,
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
    $scope.listCollectables = function(){
        spinnerService.show('collectableslistSpinner');
        var list_collectables = this; // list Voucher
        $scope.list_collectables = list_collectables;
        list_collectables.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'list/collectables/collectableslist.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.collectableslist.values.accountid,
                o.accountuserid = $scope.collectableslist.values.accountuserid,
                o.accounttype = $scope.collectableslist.values.accounttype
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

        list_collectables.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Client Name').notSortable(),
            DTColumnBuilder.newColumn('amount').withTitle('Amount Collected').notSortable(),
            DTColumnBuilder.newColumn('date_collected').withTitle('Date Collected').notSortable(),
            DTColumnBuilder.newColumn('ar_or').withTitle('AR/OR').notSortable(),
         
            
        ];
        
        list_collectables.dtInstance11 = {};
        //Datatables end



    }









}]);