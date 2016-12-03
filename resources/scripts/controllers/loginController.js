(function(){

    angular.module('application').controller('loginController',function($location,httpRequest,loginService,toastr){
        var target = this;

        target.login = function(){
            console.log(target.form);
            httpRequest.request('POST','/user/login',target.form)
                .then(function(resp){
                    var data = {
                        token : resp.data.Token,
                        login : resp.data.User.Login,
                        role : resp.data.User.Role,
                        id : resp.data.User.Id
                    };
                    loginService.logIn(data,target.form.rememberMe);
                    toastr.success('Hello '+data.login,'Successfully logged in');
                    $location.path('/home');
                },function(error) {
                    toastr.error('Invalid data.','Failed to log in');
                });
        };
        target.register = function(){
            $location.path('/register');
        };
    });

})();