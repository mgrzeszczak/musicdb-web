(function(){

    angular.module('application').controller('albumController',['$routeParams','http','toastr','$location',function($routeParams,http,toastr,$location){
        var target = this;

        http.get('/album/get/'+$routeParams.albumId,function(success){
            target.model = success.data;
            http.get('/song/fromAlbum/'+$routeParams.albumId,function(success){
                target.songPage = {Items : success.data};
            },function(error){
               console.log(error);
            });
            console.log(target.model);
        }, function(error){
            toastr.error('Album not found');
            $location.path('#');
        });

        target.return = function(){
            $location.path('/album/'+$routeParams.albumId);
        };

        target.edit = function(){
          $location.path='#album/'+$routeParams.albumId+'/edit';
        };

        target.numbers = [];
        target.years = [];
        for (var i=1900;i<=2016;i++) target.years.push(i);
        for (var i=1;i<=50;i++) target.numbers.push(i);
    }]);

})();