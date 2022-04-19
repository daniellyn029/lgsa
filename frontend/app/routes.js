// JavaScript Document
app.config(function($interpolateProvider, $httpProvider, $routeProvider, $locationProvider){
	$httpProvider.defaults.userXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common['X-Requeste-With'];
	$httpProvider.defaults.headers.common['Accept'] = 'application/json';
	$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'; 
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	$locationProvider.hashPrefix('');
    
    $routeProvider

        // Login
        .when('/', {
            templateUrl: './frontend/view/login/index.html',
            controller: 'loginController',
            resolve: {
                app: NotAuthenticated
            }
        })

        // Login
        .when('/login', {
            templateUrl: './frontend/view/login/index.html',
            controller: 'loginController',
            resolve: {
                app: NotAuthenticated
            }
        })

        // Dashboard
        .when('/dashboard', {
            templateUrl: './frontend/view/dashboard/index.html',
            controller: 'dashboardController',
            resolve: {
                app: Authenticated
            }
        })

        // Guards
        .when('/guards', {
            templateUrl: './frontend/view/guards/index.html',
            controller: 'guardsController',
            resolve: {
                app: Authenticated
            }
        })

        // Timekeeping
        .when('/timekeeping', {
            templateUrl: './frontend/view/timekeeping/index.html',
            controller: 'timekeepingController',
            resolve: {
                app: Authenticated
            }
        })

        // Clients
        .when('/clients', {
            templateUrl: './frontend/view/clients/index.html',
            controller: 'clientsController',
            resolve: {
                app: Authenticated
            }
        })

        // Voucher
        .when('/voucher', {
            templateUrl: './frontend/view/voucher/index.html',
            controller: 'voucherController',
            resolve: {
                app: Authenticated
            }
        })

        // Cash Advance
        .when('/cashadvance', {
            templateUrl: './frontend/view/cashadvance/index.html',
            controller: 'cashadvanceController',
            resolve: {
                app: Authenticated
            }
        })

        // Collectables
        .when('/collectables', {
            templateUrl: './frontend/view/collectables/index.html',
            controller: 'collectablesController',
            resolve: {
                app: Authenticated
            }
        })

        // Payroll
        .when('/payroll', {
            templateUrl: './frontend/view/payroll/index.html',
            controller: 'payrollController',
            resolve: {
                app: Authenticated
            }
        })

        // Billing
        .when('/billing', {
            templateUrl: './frontend/view/billing/index.html',
            controller: 'billingController',
            resolve: {
                app: Authenticated
            }
        })
        
        // Received Copy
        .when('/receivedcopy', {
            templateUrl: './frontend/view/receivedcopy/index.html',
            controller: 'receivedcopyController',
            resolve: {
                app: Authenticated
            }
        })

        // Accounts
        .when('/accounts', {
            templateUrl: './frontend/view/accounts/index.html',
            controller: 'accountsController',
            resolve: {
                app: Authenticated
            }
        })

        // Voucher List
        .when('/voucherlist', {
            templateUrl: './frontend/view/list/voucher/index.html',
            controller: 'voucherlistController',
            resolve: {
                app: Authenticated
            }
        })

        // Cash Advance List
        .when('/cashadvancelist', {
            templateUrl: './frontend/view/list/cashadvance/index.html',
            controller: 'cashadvancelistController',
            resolve: {
                app: Authenticated
            }
        })

        // Collectables List
        .when('/collectableslist', {
            templateUrl: './frontend/view/list/collectables/index.html',
            controller: 'collectableslistController',
            resolve: {
                app: Authenticated
            }
        })

        // Payroll List
        .when('/payrolllist', {
            templateUrl: './frontend/view/list/payroll/index.html',
            controller: 'payrolllistController',
            resolve: {
                app: Authenticated
            }
        })

        // Billing List
        .when('/billinglist', {
            templateUrl: './frontend/view/list/billing/index.html',
            controller: 'billinglistController',
            resolve: {
                app: Authenticated
            }
        })

        // Error Message
        .when('/permission',{
            templateUrl: './frontend/view/error/403/index.html',
            controller: '403Controller'
        }).otherwise({
            templateUrl: './frontend/view/error/404/index.html',
            controller: '404Controller'
        });

})