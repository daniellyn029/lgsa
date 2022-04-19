// JavaScript Document
// ng-model
// global ng-model
// url ID
// ajax
// session
app.controller('404Controller', function($scope, $rootScope, $location, $routeParams, $http, $cookieStore, $window){

    // Header Template
    $scope.error404headerTemplate="frontend/view/error/header/index.html";
    // Left Navigation Template
    $scope.error404leftNavigationTemplate="frontend/view/error/leftnavigation/index.html";
    // Footer Template
    $scope.error404footerTemplate="frontend/view/error/footer/index.html";

    if($rootScope.decodedAlready == false){
        $rootScope.decodedAlready = true;
        var url = decodeURIComponent(decodeURIComponent($location.url()));
        url = "https://hris.lancegaviensecurity.com/lgsa/#"+url;
        $window.location.href=url;
    }

});