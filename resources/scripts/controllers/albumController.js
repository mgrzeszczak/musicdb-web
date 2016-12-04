(function(){

    angular.module('application').controller('albumController',['$routeParams','http','toastr','$location','cache','commentService',function($routeParams,http,toastr,$location,cache,commentService){
        var target = this;

        var url = $location.url();
        if (url.indexOf('add')==-1){
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
            getComments(1);
        } else {
            target.model = cache.get('model');
        }



        function getComments(page){
            commentService.getComments($routeParams.albumId,'ALBUM',page!=undefined?page : 1,function(success){
                target.commentPage = success.data;
                console.log(success.data);
            },function(error){
                toastr.error('Cannot download comments');
            });
        }

        target.nextCommentPage = function(){
            getComments(target.commentPage.PageNumber+1);
        };
        target.previousCommentPage = function(){
            getComments(target.commentPage.PageNumber-1);
        };

        target.postComment = function(){
            target.comment.EntityId = $routeParams.albumId;
            target.comment.EntityType = 'ALBUM';
            http.post('/comment/add',target.comment,function(success){
                toastr.success('Success');
                getComments(1);
                console.log(success);
            },function(error){
                toastr.error('Error');
                console.log(error);
            });
        };

        target.return = function(){
            $location.path( (url.indexOf('add')==-1) ? ('/album/show/'+$routeParams.albumId) : '/artist/show/'+target.model.Artist.Id);
        };

        target.edit = function(){
          $location.path('/album/edit/'+$routeParams.albumId);
        };

        target.save = function(){
            var onSuccess = function(success){
                toastr.success('Success');
                $location.path('/album/show/'+success.data.Id);
            };
            var onError = function(error){
                console.log(error);
                toastr.error(error.data.Error);
            };
            if ($location.url().indexOf('edit')==-1) http.post('/album/add',target.model,onSuccess,onError);
            else http.put('/album/update',target.model,onSuccess,onError);
        };

        target.addSong = function(){
            var song = {Album : target.model, Number : 1};
            cache.put('model',song);
            $location.path('/song/add');
        };

        target.numbers = [];
        target.years = [];
        for (var i=1900;i<=2016;i++) target.years.push(i);
        for (var i=1;i<=50;i++) target.numbers.push(i);
    }]);

})();