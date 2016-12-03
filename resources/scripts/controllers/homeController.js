(function(){

    angular.module('application').controller('homeController',function(http){
        var target = this;
        target.focus = 'song';

        var search = function(type,page){
            var url = '/'+type+'/search?searchText='+target.searchText;
            if (page!=undefined) url = url+'&pageNumber='+page;

            http.get(url,
                function(success){
                    target[type+'Page'] = success.data;
                    console.log(success.data);
                },
                function(error){
                    console.log(error);
                });
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