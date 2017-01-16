(function(){

    angular.module('application').controller('homeController',['http','$location','cache',function(http,$location,cache){
        var target = this;
        target.focus = 'song';

        if (cache.get('searchText')!=undefined) target.searchText = cache.get('searchText');

        var search = function(type,page){

            var url = '/'+type+'/search?searchText='+((target.searchText===undefined)? '' : target.searchText);
            if (page!=undefined) url = url+'&pageNr='+page;

            http.get(url,
                function(success){
                    target[type+'Page'] = success.data;
                },
                function(error){

                });
        };

        target.addArtist = function(){
            $location.path('/artist/add');
        };

        target.nextPage = function(){
            search(target.focus,target[target.focus+'Page'].PageNumber+1);
        };

        target.previousPage = function(){
            search(target.focus,target[target.focus+'Page'].PageNumber-1);
        };

        target.search = function(){
            search('song');
            search('album');
            search('artist');
        };
        target.search();
    }]);
})();