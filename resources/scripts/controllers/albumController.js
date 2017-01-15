(function(){

    angular.module('application').controller('albumController',['$routeParams','http','toastr','$location','cache','commentService','loginService'
        ,function($routeParams,http,toastr,$location,cache,commentService,loginService){
        var target = this;

        target.role = loginService.getRole();

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
            getRating();
        } else {
            target.model = cache.get('model');
            if (target.model === undefined){
                $location.path('#');
            }
        }


        target.change = function(){
            console.log(target.userRating);
            if (rated===false){
                target.userRating.EntityType = 'ALBUM';
                target.userRating.EntityId = $routeParams.albumId;
                rated = true;
                addRating();
                return;
            }
            updateRating();
        };

        var rated = false;
        function getRating(){
            http.get('/rating/get?entityType=ALBUM&entityId='+$routeParams.albumId,function(success){
                target.userRating = success.data;
                if (target.userRating!=null) rated = true;
            }, function(error){

            });

            http.get('/rating/average?entityType=ALBUM&entityId='+$routeParams.albumId,function(success){
                target.averageRating = success.data.toFixed(2);;
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
            commentService.deleteComment(id);
            getComments(target.commentPage.PageNumber);
        };

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

            if (target.model === undefined || target.model.Name === undefined || $.trim(target.model.Name)==='' ){
                toastr.error('Fields cannot be empty!');
                return;
            }
            console.log(target.model);
            var onSuccess = function(success){
                toastr.success('Success');
                $location.path('/album/show/'+success.data.Id);
            };
            var onError = function(error){
                console.log(error);
                toastr.error(http.getErrorMessage(error));
            };
            if ($location.url().indexOf('edit')==-1) http.post('/album/add',target.model,onSuccess,onError);
            else http.put('/album/update',target.model,onSuccess,onError);
        };

        target.delete = function(){
            http.delete('/album/delete/'+target.model.Id,function(success){
                toastr.success('Success');
                $location.path('/artist/show/'+target.model.Artist.Id);
            }, function(error){
                toastr.error(http.getErrorMessage(error));
                console.log(error);
            });
        };

        target.addSong = function(){
            var song = {Album : target.model, Number : 1, Length : '00:00:00'};
            cache.put('model',song);
            $location.path('/song/add');
        };

        target.numbers = [];
        target.years = [];
        for (var i=1900;i<=2016;i++) target.years.push(i);
        for (var i=1;i<=50;i++) target.numbers.push(i);
    }]);

})();