(function(){

    angular.module('application').controller('registerController',function($location,httpRequest,toastr){
        var target = this;

        target.register = function(){
            console.log(target.form);
            httpRequest.request('POST','/user/register',target.form)
                .then(function(resp){
                    console.log(resp.data);
                    toastr.success('','Successfully registered');
                    $location.path('/login');
                },function(error) {
                    console.log(error.data);
                    toastr.error('Invalid data.','Failed to register')
                });
        };
    });

})();