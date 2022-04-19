// JavaScript Document

//Initializing autoload
app.run(function ($rootScope, $http, $cookieStore, $location, $routeParams, $window) {
  
    // Decode
    $rootScope.decodedAlready = false;

    $rootScope.dymodalstat = false;
    $rootScope.dymodalclass = null;
    $rootScope.dymodaltitle = null;
    $rootScope.dymodalmsg = null;
    $rootScope.dymodalstyle = null;
    $rootScope.dymodalicon = null;
    $rootScope.title = "Viniel Software Solutions";

    // account type
    $rootScope.admin = 'Admin';

    // active menu
    $rootScope.activeClass = function() {
        var curr = $window.location;
        curr = curr.toString();

        $(".sidebar-menu").find(".active").removeClass("active");
        $(".sidebar-menu li").each(function() {
            if($(this).attr("id")) {
                var eleId = $(this).attr("id");
                eleId = eleId;
                var n = curr.indexOf(eleId);
                if(n>0) {
                    $("#"+eleId).addClass("active");
                }
            }
        });
    }

    // Employee
    $rootScope.customSelect = function(){
        $(".server_side_employee").select2({
            ajax: {
                url: apiUrl+'global/get_guard.php',
                dataType: 'json',
                delay: 250,
                data: function(params){
                    var query = {
                        q: params.term, // search term
                        page: params.page 
                    }
                    //console.log(params);
                    // Query parameters will be ?search=[term]&page=[page]
                    return query;
                },
                processResults: function (data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 10) < data.total_count
                        } 
                    };
                },
                transport: function (params, success, failure) {
                    var $request = $.ajax(params);
                    
                    $request.then(success);
                    $request.fail(failure);
                    //console.log($request);
                    return $request;
                },
                cache: true
            },
            placeholder: 'Select Employee',
            minimumInputLength: 1,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
        });
        function formatRepo(repo){
            if(repo.loading){
                return repo.text;
            }

            var $container = $(
                "<div class='select2-result-repository clearfix'>" +
                    "<div class='select2-result-repository__meta'>" +
                        "<div class='select2-result-repository__title'></div>" +
                    "</div>" +
                "</div>"
            );
            $container.find(".select2-result-repository__title").text(repo.fullname);

            return $container;

        }
        function formatRepoSelection (repo) {
            return repo.fullname || repo.text;
        }

        $rootScope.serverSideEmployee = $('.server_side_employee');

    }

    // Get All Employee
    $rootScope.getAllEmployee = function(){
        $rootScope.get_all_employee = [];
        var urlData = {
            'accountuserid': $cookieStore.get('accountuserid')
        }
        $http.post(apiUrl+'global/get_all_employee.php', urlData)
        .then(function(result){
            if(result.data.status == "empty"){
                $rootScope.get_all_employee = [];
            }else{
                $rootScope.get_all_employee = result.data;
            }
        },function(error){}).finally(function(){});
    }

    // ajax error
    $rootScope.modalDanger = function() {
        $rootScope.dymodalstat = true;
        $rootScope.dymodalclass = "alert alert-danger";
        $rootScope.dymodaltitle = "Oops...";
        $rootScope.dymodalmsg = "Something went wrong! Please reload the page.";
        $rootScope.dymodalstyle = "btn-danger";
        $rootScope.dymodalicon = "fa fa-exclation-circle";
        $("#dymodal").modal("show");
    }

    // Logout
    $rootScope.logOut = function(){
		$cookieStore.remove('isAuthenticated');
        $cookieStore.remove('accountId');
        $cookieStore.remove('accountuserid');
        $cookieStore.remove('accounttype');
        $('#collectablesList').DataTable().state.clear(); // Collectables List
        $location.path('/login');
        // window.location.href="#/login";
    }  
    
});

// URL
var apiUrl = "/lgsa/backend/";

