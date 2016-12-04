(function(){
    angular.module('application').controller('navigationController',function(loginService){
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
        };

    });
})();