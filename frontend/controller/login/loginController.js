app.controller('loginController',function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $timeout, spinnerService){

    // Response Cookies
    if($cookieStore.get('isAuthenticated')){
        if($cookieStore.get('accounttype') == $rootScope.admin){
            $location.path('/dashboard');
        }else{
            $location.path('/permission');
        }
    }

    // Login
    $scope.loginForm = function(){

        // Empty fields 
        if($scope.username==null && $scope.password==null){
            $rootScope.dymodalstat=true;
            $rootScope.dymodalclass = "alert alert-warning";
            $rootScope.dymodaltitle="Warning!";
            $rootScope.dymodalmsg="Please input the fields.";
            $rootScope.dymodalstyle="btn-warning";
            $rootScope.dymodalicon="fa fa-exclamation-triangle";
            $("#dymodal").modal("show");
            return;
        }

        // No username 
        if($scope.username==null && $scope.password!=null){
            $rootScope.dymodalstat=true;
            $rootScope.dymodalclass = "alert alert-warning";
            $rootScope.dymodaltitle="Warning!";
            $rootScope.dymodalmsg="Please input username.";
            $rootScope.dymodalstyle="btn-warning";
            $rootScope.dymodalicon="fa fa-exclamation-triangle";
            $("#dymodal").modal("show");
            return;
        }

        // No password
        if($scope.username!=null && $scope.password==null){
            $rootScope.dymodalstat=true;
            $rootScope.dymodalclass = "alert alert-warning";
            $rootScope.dymodaltitle="Warning!";
            $rootScope.dymodalmsg="Please input password.";
            $rootScope.dymodalstyle="btn-warning";
            $rootScope.dymodalicon="fa fa-exclamation-triangle";
            $("#dymodal").modal("show");
            return;
        }

        var urlData = {
            'username': $scope.username,
            'password': $scope.password
        }
        $http.post(apiUrl+'login/login.php',urlData)
        .then(function(response, status){
            var data = response.data;
            if(data.status=='success'){
                $cookieStore.put('isAuthenticated', new Date());
                $cookieStore.put('accountId', data.accountid);
                $cookieStore.put('accountuserid', data.accountuserid);
                $cookieStore.put('accounttype', data.accountrole);
                $cookieStore.put('bodyChange',true);
                if($cookieStore.get('isAuthenticated') && $cookieStore.get('accountId') && $cookieStore.get('accounttype')==$rootScope.admin) {
                    spinnerService.show('loginspinner');
                    $timeout(function(){
                        spinnerService.hide('loginspinner');
                        $scope.loggedIn = true;
                    }, 1000);
                    $location.path('/dashboard');
                }else{
                    $location.path('/permission');
                }
            }else if(data.status=='blocked'){
                $rootScope.dymodalstat=true;
                $rootScope.dymodalclass = "alert alert-warning";
                $rootScope.dymodaltitle="Warning!";
                $rootScope.dymodalmsg="Account has been blocked.";
                $rootScope.dymodalstyle="btn-warning";
                $rootScope.dymodalicon="fa fa-exclamation-triangle";
                $scope.username=null;
                $scope.password=null;
                $("#dymodal").modal("show");       
            }else if(data.status=='notfound'){
                $rootScope.dymodalstat=true;
                $rootScope.dymodalclass = "alert alert-warning";
                $rootScope.dymodaltitle="Warning!";
                $rootScope.dymodalmsg="Invalid username or password.";
                $rootScope.dymodalstyle="btn-warning";
                $scope.username=null;
                $scope.password=null;
                $("#dymodal").modal("show");          
            }else if(data.status=='empty'){
                $rootScope.dymodalstat=true;
                $rootScope.dymodalclass="alert alert-warning";
                $rootScope.dymodaltitle="Warning!";
                $rootScope.dymodalmsg="Please input the fields.";
                $rootScope.dymodalstyle="btn-warning";
                $rootScope.dymodalicon="fa fa-exclamation-triangle";
                $("#dymodal").modal("show");
            }
        },function(error){
            $rootScope.modalDanger();
        });   
    }

});