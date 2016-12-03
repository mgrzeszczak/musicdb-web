(function(){

    angular.module('application').controller('songController',['$routeParams','http','$location','toastr','$sce',function($routeParams,http,$location,toastr,$sce){
        var target = this;
        http.get('/song/get/'+$routeParams.songId,function(success){
            target.model = success.data;
            console.log(target.model);
        }, function(error){
            toastr.error('Song not found');
            $location.path('#');
        });

        target.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        target.return = function(){
            $location.path('/song/'+$routeParams.songId);
        };

        target.edit = function(){
            $location.path='#song/'+$routeParams.songId+'/edit';
        };

        target.numbers = [];
        for (var i=1;i<=50;i++) target.numbers.push(i);
    }]);

})();