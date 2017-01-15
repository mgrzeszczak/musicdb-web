(function(){

    angular.module('application').controller('registerController',function($location,http,toastr){
        var target = this;

        target.register = function(){
            console.log(target.form);
            if (target.form === undefined
                || target.form.email === undefined
                || target.form.login === undefined
                || target.form.password === undefined
                || $.trim(target.form.email) === ''
                || $.trim(target.form.login) === ''
                || $.trim(target.form.password) === ''){
                toastr.error("Fields cannot be empty.");
                return;
            }
	    http.post('/user/register',target.form,function(success){
                    toastr.success('','Successfully registered!');
                    $location.path('/login');
		},function(error){
                    console.log(error.data);
                    toastr.error('Invalid data.',http.getErrorMessage(error))
		});
        };
    });

})();