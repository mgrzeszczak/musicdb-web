(function(){

    angular.module('application').controller('registerController',function($location,http,toastr){
        var target = this;

        target.register = function(){
            console.log(target.form);
	    http.post('/user/register',target.form,function(success){
                    toastr.success('','Successfully registered');
                    $location.path('/login');
		},function(error){
                    console.log(error.data);
                    toastr.error('Invalid data.','Failed to register')
		});
        };
    });

})();