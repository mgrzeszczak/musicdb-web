(function(){
    angular.module('application').controller('navigationController',['loginService','toastr','cache','$location','$routeParams',function(loginService,toastr,cache,$location,$routeParams){
        var target = this;

        target.isLoggedIn = function(){
            return loginService.isLoggedIn();
        };

        target.getLogin = function(){
            return loginService.getLogin();
        };

        target.getRole = function(){
            return loginService.getRole();
        };

        target.logOut = function(){
            loginService.logOut();
            toastr.success('Successfully logged out!');
        };

        console.log('NAVIGATION');
        console.log($location.url());
        target.notHome = function(){
            return document.getElementById('search-box')==undefined;
        };

        target.search = function(){
            cache.put('searchText',target.searchText);
            $location.url('/home');
        }

    }]);
})();