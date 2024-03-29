(function(){
    angular.module('application').config(function($routeProvider,$locationProvider,$httpProvider, toastrConfig){
        $routeProvider
            .when('/song/show/:songId',{
                templateUrl : 'resources/pages/songs/index.html',
                controller :'songController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/song/edit/:songId',{
                templateUrl : 'resources/pages/songs/edit.html',
                controller :'songController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/song/add',{
                templateUrl : 'resources/pages/songs/edit.html',
                controller :'songController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/album/show/:albumId',{
                templateUrl : 'resources/pages/albums/index.html',
                controller :'albumController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/album/edit/:albumId',{
                templateUrl : 'resources/pages/albums/edit.html',
                controller :'albumController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/album/add',{
                templateUrl : 'resources/pages/albums/edit.html',
                controller :'albumController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/artist/show/:artistId',{
                templateUrl : 'resources/pages/artists/index.html',
                controller :'artistController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/artist/edit/:artistId',{
                templateUrl : 'resources/pages/artists/edit.html',
                controller :'artistController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/artist/add',{
                templateUrl : 'resources/pages/artists/edit.html',
                controller :'artistController',
                controllerAs : 'app',
                authorize : true
            })
            .when('/login',{
                templateUrl : 'resources/pages/forms/login.html',
                controller :'loginController',
                controllerAs : 'app',
                authorize : false
            })
            .when('/register',{
                templateUrl : 'resources/pages/forms/register.html',
                controller :'registerController',
                controllerAs : 'app',
                authorize : false
            })
            .otherwise({
                templateUrl : 'resources/pages/home/index.html',
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

        $httpProvider.defaults.useXDomain = true;
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
