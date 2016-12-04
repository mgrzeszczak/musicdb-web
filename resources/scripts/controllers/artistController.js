(function(){

    angular.module('application').controller('artistController',['$routeParams','http','toastr','$location','$window','cache','commentService',function($routeParams,http,toastr,$location,$window,cache,commentService){
        var target = this;

        var url = $location.url();
        if (url.indexOf('add')==-1){
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
            getComments(1);
        } else {
            target.model = {Genre : 'Rock'};
        }

        http.get('/artist/genres',function(success){
            console.log(success.data);
            target.genres = success.data;
        }, function(error){
           console.log(error);
        });

        target.edit = function(){
            $location.path('/artist/edit/'+$routeParams.artistId);
        };

        target.addAlbum = function(){
            var album = {Artist : target.model, Number : 1};
            cache.put('model',album);
            $location.path('/album/add');
        };



        function getComments(page){
            commentService.getComments($routeParams.artistId,'ARTIST',page!=undefined?page : 1,function(success){
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
            target.comment.EntityId = $routeParams.artistId;
            target.comment.EntityType = 'ARTIST';
            http.post('/comment/add',target.comment,function(success){
                toastr.success('Success');
                getComments(1);
                console.log(success);
            },function(error){
                toastr.error('Error');
                console.log(error);
            });
        };

        target.save = function(){
            var onSuccess = function(success){
                toastr.success('Success');
                $location.path('/artist/show/'+success.data.Id);
            };
            var onError = function(error){
                console.log(error);
                toastr.error(error.data.Error);
            };
            if ($location.url().indexOf('edit')==-1) http.post('/artist/add',target.model,onSuccess,onError);
            else http.put('/artist/update',target.model,onSuccess,onError);
        };

        target.return = function(){
            $location.path(url.indexOf('add')==-1? ('/artist/show/'+target.model.Id) : '/');
        };
    }]);

})();