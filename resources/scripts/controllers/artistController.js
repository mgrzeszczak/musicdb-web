(function(){

    angular.module('application').controller('artistController',['$routeParams','http','toastr','$location','$window','cache','commentService','loginService'
        ,function($routeParams,http,toastr,$location,$window,cache,commentService,loginService){
        var target = this;

        target.role = loginService.getRole();
        console.log(target.role);

        var url = $location.url();
        if (url.indexOf('add')==-1){
            http.get('/artist/get/'+$routeParams.artistId,function(success){
                console.log(target.model);
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
            getRating();
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
            var album = {Artist : target.model, Number : 1, Year : 1900, Length : '00:00:00'};
            cache.put('model',album);
            $location.path('/album/add');
        };


        target.change = function(){
            console.log(target.userRating);
            if (rated===false){
                target.userRating.EntityType = 'ARTIST';
                target.userRating.EntityId = $routeParams.artistId;
                rated = true;
                addRating();
                return;
            }
            updateRating();
        };

        var rated = false;
        function getRating(){
            http.get('/rating/get?entityType=ARTIST&entityId='+$routeParams.artistId,function(success){
                target.userRating = success.data;
                if (target.userRating!=null) rated = true;
            }, function(error){

            });

            http.get('/rating/average?entityType=ARTIST&entityId='+$routeParams.artistId,function(success){
                target.averageRating = success.data.toFixed(2);
            }, function(error){

            });
        }

        function addRating(){
            http.post('/rating/add',target.userRating,function(success){
                console.log(success);
                target.userRating = success.data;
                getRating();
            },function(error){
                console.log(error);
                getRating();
            });

        }

        function updateRating(){
            http.put('/rating/update',target.userRating,function(success){
                console.log(success);
                target.userRating = success.data;
                getRating();
            },function(error){
                console.log(error);
                getRating();
            });
        }

        target.deleteComment = function(id){
            commentService.deleteComment(id,function(){
                getComments(target.commentPage.PageNumber);
            });
        };

        function getComments(page){
            commentService.getComments($routeParams.artistId,'ARTIST',page!=undefined?page : 1,function(success){
                if (success.data.Items.length==0 && success.data.PageNumber > success.data.TotalPages){
                    getComments(success.data.TotalPages);
                } else target.commentPage = success.data;
                console.log('Comments!');
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
            if (target.comment === undefined || target.comment.Content === undefined || $.trim(target.comment.Content) === ''){
                toastr.error('Comment cannot be empty!');
                return;
            }
            target.comment.EntityId = $routeParams.artistId;
            target.comment.EntityType = 'ARTIST';
            http.post('/comment/add',target.comment,function(success){
                toastr.success('Comment posted');
                getComments(1);
                console.log(success);
                target.comment.Content = '';
            },function(error){
                toastr.error(http.getErrorMessage(error));
                console.log(error);
            });
        };

        target.save = function(){
            console.log('Saving model: ');
            console.log(target.model);
            if (target.model.Name === undefined || $.trim(target.model.Name) === '') {
                toastr.error("Name cannot be empty!");
                return;
            }

            var onSuccess = function(success){
                toastr.success('Saved');
                $location.path('/artist/show/'+success.data.Id);
            };
            var onError = function(error){
                console.log(error);
                toastr.error(http.getErrorMessage(error));
            };
            if ($location.url().indexOf('edit')==-1) http.post('/artist/add',target.model,onSuccess,onError);
            else http.put('/artist/update',target.model,onSuccess,onError);
        };

        target.delete = function(){
            http.delete('/artist/delete/'+target.model.Id,function(success){
                toastr.success('Artist deleted');
                $location.path('#');
            }, function(error){
                toastr.error(http.getErrorMessage(error));
                console.log(error);
            });
        };

        target.return = function(){
            $location.path(url.indexOf('add')==-1? ('/artist/show/'+target.model.Id) : '/');
        };
    }]);

})();