(function(){
    angular.module('application').config(function($routeProvider,$locationProvider, toastrConfig){
        $routeProvider
            .when('/song/:songId',{
                templateUrl : 'resources/pages/songs/index.html',
                controller :'songController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/song',{
                template : 'WHAT UP',
                authorize : false
            })
            .when('/album',{
                template : 'albumTest',
                controller :'albumController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/artist',{
                template : 'aritstTest',
                controller :'artistController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/search',{
                template : 'albumTest',
                controller :'searchController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/login',{
                templateUrl : 'resources/pages/songs/index.html',
                controller :'loginController',
                controllerAs : 'app',
                authorize : false
            })
            .when('/register',{
                template : 'registerTest',
                controller :'registerController',
                controllerAs : 'app',
                authorize : false
            })
            .otherwise({
                template : 'home',
                controller :'homeController',
                controllerAs : 'app',
                authorize: true
            });

        angular.extend(toastrConfig, {
            allowHtml: true,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            positionClass: 'toast-top-right',
            tapToDismiss: true,
            timeOut: 3000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    })
        .run(function ($rootScope, $location, loginService, toastr) {
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                if(next.authorize === true) {
                    if(!loginService.isLoggedIn() || (next.role && loginService.getRole() != next.role)) {
                        toastr.error("Brak wymaganych uprawnień, aby wyświetlić stronę. Zaloguj się.","Brak uprawnień!");
                        $location.path('/login');
                    }
                }
            });
        });

})();
