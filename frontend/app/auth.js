// JavaScript Document

// allow session create or login
var Authenticated = function($q, $cookieStore, $location, $rootScope){
	var url = $location.url();
	var defer = $q.defer();
	if($cookieStore.get('isAuthenticated')){
		// code here to trap url and account type!
		if( $cookieStore.get('accounttype') == $rootScope.admin ){
			defer.resolve();
		}else if( $cookieStore.get('accounttype') == $rootScope.accounting ){
			if( (url.indexOf("dashboard")) >= 0 ){
				defer.resolve();
			}else{
				$location.path("/permission");
			}
		}else{
			$location.path("/permission");
		}
		
	}else{
		$location.path("/login");
	}	
	return defer.promise;
}
// No Session
var NotAuthenticated = function($q, $cookieStore, $location, $rootScope){
	var defer = $q.defer();
	defer.resolve();
	return defer.promise;
}	