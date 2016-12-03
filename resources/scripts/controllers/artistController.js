(function(){

    angular.module('application').controller('artistController',['$routeParams','http','toastr','$location',function($routeParams,http,toastr,$location){
        var target = this;

        http.get('/artist/get/'+$routeParams.artistId,function(success){
            target.model = success.data;
            http.get('/album/byArtist/'+$routeParams.artistId,function(success){
                target.albumPage = {Items : success.data};
            },function(error){
                console.log(error);
            });
            console.log(target.model);
        }, function(error){
            toastr.error('Album not found');
            $location.path('#');
        });

        target.edit = function(){
            $location.path='#artist/'+$routeParams.artistId+'/edit';
        };

        target.return = function(){
            $location.path('/artist/'+$routeParams.artistId);
        };
    }]);

})();