app.controller('collectablesController',[ '$scope', '$rootScope', '$location', '$routeParams', '$http', '$cookieStore', '$timeout', 'spinnerService', '$filter', 'Upload', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$compile', 'FileUploader',
function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService, $filter, Upload, DTOptionsBuilder, DTColumnBuilder, $q, $compile, FileUploader, b){

    // Decode
    $rootScope.decodedAlready = false;

    // Header Template
    $scope.headerTemplate="frontend/view/collectables/template/header/index.html";
    // Left Navigation Template
    $scope.leftNavigationTemplate="frontend/view/collectables/template/leftnavigation/index.html";
    // Footer Template
    $scope.footerTemplate="frontend/view/collectables/template/footer/index.html";
    // Change Password Template
    $scope.changePasswordTemplate="frontend/view/modal/change_password.html";

    // Info
    $scope.collectables = {
        values: {
            accountid: $cookieStore.get('accountId'),
            accountuserid: $cookieStore.get('accountuserid'),
            accounttype: $cookieStore.get('accounttype'),
            collectablesInformation: null,
        },
        active: function(){

            var urlData = {
                'accountid': $scope.collectables.values.accountid,
                'accountuserid': $scope.collectables.values.accountuserid,
                'accounttype': $scope.collectables.values.accounttype
            }
            $http.post(apiUrl+'account_info/active_information.php', urlData)
            .then(function(result, status){     
                spinnerService.show('collectablesSpinner');     
                if(result.status=='error'){
					$scope.collectables.values.collectablesInformation = [];
					$rootScope.modalDanger();
				}else if(result.status=='empty'){
                    $scope.collectables.values.collectablesInformation = [];
                    $rootScope.modalDanger();
				}else{              
                    $scope.collectables.values.collectablesInformation = result.data;
                    //console.log($scope.collectables.values.collectablesInformation);
                }
            }
            , function(error){
                $rootScope.modalDanger();
            })
            .finally(function(){
                $timeout(function(){
                    spinnerService.hide('collectablesSpinner');
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
    $scope.collectablesList = function(){
        spinnerService.show('collectablesSpinner');
        var collectables_list = this; // collectables list
        $scope.collectables_list = collectables_list;
        collectables_list.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax',{
            url: apiUrl+'collectables/collectablesList.php',
            type: 'POST',
            data: function(o){
                o.accountid = $scope.collectables.values.accountid,
                o.accountuserid = $scope.collectables.values.accountuserid,
                o.accounttype = $scope.collectables.values.accounttype
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
        // .withButtons([
        //     {
        //         text: '<i class="fa fa-plus" aria-hidden="true"></i> Add Collectable',
        //         className: 'dt-button-addCollectables',
        //         action: function ( e, dt, node, config ) {
        //             $(".dt-button-addCollectables").attr({'data-target':'#addCollectables','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        //         }

        //     }
        // ])
        // collectables_list.dtOptions.drawCallback = function() {
        //     $(".dt-button-addCollectables").attr({'data-target':'#addCollectables','data-toggle':'modal','onclick':'angular.element(this).scope().add_view()'}).removeAttr("href").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"1.5em","margin-left":"10px","font-size":"10px"});           
        // };
        collectables_list.dtColumns = [
            DTColumnBuilder.newColumn('id').withTitle('#').notSortable(),
            DTColumnBuilder.newColumn('client_name').withTitle('Client Name').notSortable(),
            DTColumnBuilder.newColumn('date_issued').withTitle('Date Issued').notSortable(),
            DTColumnBuilder.newColumn('total').withTitle('Total').notSortable(),
            DTColumnBuilder.newColumn('collected_amount').withTitle('Collected Amount').notSortable(),
            DTColumnBuilder.newColumn('balance').withTitle('Balance').notSortable(),
            DTColumnBuilder.newColumn('date_collected').withTitle('Date Collected').notSortable(),
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
                                        + '<li><a data-toggle="modal" data-target="#addCollectables"><i class="fa fa-pencil-square"></i> Add </a></li>'
                                        + '<li><a data-toggle="modal" data-target="#collectibleLogs" onclick="angular.element(this).scope().getCollectibleLogs(\'' +data.client_id+'\',\'' +data.client_name+'\')"><i class="fa fa-history" aria-hidden="true"></i> Logs</a></li>'
                                        + '<li><a data-toggle="modal" data-target="#"><i class="fa fa-check"></i> Approved </a></li>'
                                        + '</ul></div>';
                return action_elem;
            })
            
        ];

        $("#collectablesList").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();
    
            // Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                collectables_list.dtInstance4.dataTable.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            // console.log(collectables_list.dtInstance4.dataTable);
        });

        collectables_list.dtInstance4 = {};


        // // Collectible Logs Details
        // $scope.collectible_logs_list = function(){

        //     var collect_logs = this; // collectible logs details
        //     $scope.collect_logs = collect_logs;
        //     collect_logs.dtOptions = DTOptionsBuilder.newOptions()
        //     .withOption('ajax',{
        //         url: apiUrl+'collectables/collectableLogsDetails.php',
        //         type: 'POST',
        //         data: function(o){
        //            o.accountid = $scope.collectables.values.accountid,
        //            o.accountuserid = $scope.collectables.values.accountuserid,
        //            o.client_id = $scope.collectibleLogs || ''

        //         }
        //     })
        //     .withDataProp('data') // parameter name of list use in getLeads Function
        //     .withOption('responsive', true)
        //     .withOption('autoWidth', false)
        //     .withOption('paging', true)
        //     .withOption('searching', {"regex": true})
        //     .withOption('lengthMenu',[[10, 25, 50, -1], [10, 25, 50, "All"]])
        //     .withOption('pageLength', 10)
        //     .withOption('order',[0,'asc'])
        //     .withPaginationType('full_numbers')
        //     .withOption('aaSorting',[0,'asc'])
        //     collect_logs.dtColumns = [
        //         DTColumnBuilder.newColumn('logs_id').withTitle('#').notSortable(),
        //         DTColumnBuilder.newColumn('logs_client_name').withTitle('Client Name').notSortable(),
        //         DTColumnBuilder.newColumn('logs_date_from_to').withTitle('From-To Date').notSortable(),
        //         DTColumnBuilder.newColumn('logs_total').withTitle('Total').notSortable(),
        //         DTColumnBuilder.newColumn('logs_amount_collected').withTitle('Collected Amount').notSortable(),
        //         DTColumnBuilder.newColumn('logs_balance').withTitle('Balance').notSortable(),
        //         DTColumnBuilder.newColumn('logs_date_collected').withTitle('Date Collected').notSortable(),
        //         DTColumnBuilder.newColumn(null).withTitle('logs_status').notSortable()
        //         .renderWith(function(data, type, full, meta){
        //             return '<span class="'+data.account_icon+'">'+' '+data.status+'</span>';
        //         }),
        //         DTColumnBuilder.newColumn('logs_datetime_updated').withTitle('Date - Time Updated').notSortable(),
        //         DTColumnBuilder.newColumn('logs_date_updated_by').withTitle('Updated By').notSortable()
        //     ];
           
        //     collect_logs.dtInstance17 = {};
        // }


        // // Get Collectible Logs
        // $scope.getCollectibleLogs = function(client_id, client_name){
        //     $scope.collectibleLogs = client_id;
        //     $scope.collectibleLogs_client_name = client_name;
        //     $scope.collect_logs.dtInstance17.reloadData();
        //     $("#collectible_logs_client_name").text($scope.collect_logs.collectibleLogs_client_name);

        // }
    }

    // For Responsive the Datatables in Collectable Logs 
    $('#collectibleLogs').on('shown.bs.modal', function() {
        // Get the datatable which has previously been initialized
        var dataTable = $('#collectible_logs_list').DataTable();
        //recalculate the dimensions
        dataTable.columns.adjust().responsive.recalc();
        // console.log(dataTable);
    });
    



}]);