(function(){

    angular.module('application').controller('homeController',function(http,$location){
        var target = this;
        target.focus = 'song';

        var search = function(type,page){
            console.log(target.searchText);
            //console.log(type,page);

            var url = '/'+type+'/search?searchText='+target.searchText;
            if (page!=undefined) url = url+'&pageNr='+page;

            http.get(url,
                function(success){
                    target[type+'Page'] = success.data;
                    console.log(success.data);
                },
                function(error){
                    console.log(error);
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
    });
})();