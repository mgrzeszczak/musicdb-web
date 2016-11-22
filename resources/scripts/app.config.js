(function(){
    angular.module('MusicDB')
        .config(function($routeProvider){
            $routeProvider.when('/song',{
                templateUrl : 'resources/pages/songs/index.html'
            })
        });
})();