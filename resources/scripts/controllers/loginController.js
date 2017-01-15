(function(){

    angular.module('application').controller('loginController',function($location,http,loginService,toastr){
        var target = this;

        target.login = function(){
            console.log(target.form);
            if (target.form === undefined
                || target.form.login === undefined
                || target.form.password === undefined
                || $.trim(target.form.login) === ''
                || $.trim(target.form.password) === '') {
                toastr.error("Fields cannot be empty.");
                return;
            }

            http.post('/user/login',target.form,function(success){
                var data = {
                    token : success.data.Token,
                    login : success.data.User.Login,
                    role : success.data.User.Role,
                    id : success.data.User.Id
                };
                loginService.logIn(data,target.form.rememberMe);
                toastr.success('Hello '+data.login,'Successfully logged in');
                $location.path('/home');
            },function(error){
                toastr.error('Invalid data.',http.getErrorMessage(error));
            });
        };
        target.register = function(){
            $location.path('/register');
        };
    });

})();