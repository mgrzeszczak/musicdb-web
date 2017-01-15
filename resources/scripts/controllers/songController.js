(function(){

    angular.module('application').controller('songController',['$routeParams','http','$location','toastr','$sce','$window','cache','commentService','loginService',
        function($routeParams,http,$location,toastr,$sce,$window,cache,commentService,loginService){
        var target = this;

        target.role = loginService.getRole();

        var url = $location.url();
        if (url.indexOf('add')==-1){
            http.get('/song/get/'+$routeParams.songId,function(success){
                target.model = success.data;
                console.log(target.model);
            }, function(error){
                toastr.error('Song not found');
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
                target.userRating.EntityType = 'SONG';
                target.userRating.EntityId = $routeParams.songId;
                rated = true;
                addRating();
                return;
            }
            updateRating();
        };


        var rated = false;
        function getRating(){
            http.get('/rating/get?entityType=SONG&entityId='+$routeParams.songId,function(success){
               target.userRating = success.data;
               if (target.userRating!=null) rated = true;
            }, function(error){

            });

            http.get('/rating/average?entityType=SONG&entityId='+$routeParams.songId,function(success){
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
            commentService.deleteComment(id);
            getComments(target.commentPage.PageNumber);
        };

        function getComments(page){
            commentService.getComments($routeParams.songId,'SONG',page!=undefined?page : 1,function(success){
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
            target.comment.EntityId = $routeParams.songId;
            target.comment.EntityType = 'SONG';
            http.post('/comment/add',target.comment,function(success){
                toastr.success('Success');
                getComments(1);
                console.log(success);
            },function(error){
                toastr.error('Error');
                console.log(error);
            });
        };

        target.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        target.return = function(){
            $location.path( (url.indexOf('add')==-1) ? ('/song/show/'+$routeParams.songId) : '/album/show/'+target.model.Album.Id);
        };



        target.edit = function(){
            console.log('test');

            $location.path('/song/edit/'+$routeParams.songId);
            //$window.location.assign('#song/'+$routeParams.songId+'/edit');
        };

        target.save = function(){

            if (target.model === undefined || target.model.Title === undefined || $.trim(target.model.Title)===''){
                toastr.error('Title cannot be empty!');
                return;
            }

            var onSuccess = function(success){
                toastr.success('Success');
                $location.path('/song/show/'+success.data.Id);
            };
            var onError = function(error){
                console.log(error);
                toastr.error(http.getErrorMessage(error));
            };
            if ($location.url().indexOf('edit')==-1) http.post('/song/add',target.model,onSuccess,onError);
            else http.put('/song/update',target.model,onSuccess,onError);
        };

        target.delete = function(){
            http.delete('/song/delete/'+target.model.Id,function(success){
                toastr.success('Success');
                $location.path('/album/show/'+target.model.Album.Id);
            }, function(error){
                toastr.error(http.getErrorMessage(error));
                console.log(error);
            });
        };

        target.numbers = [];
        for (var i=1;i<=50;i++) target.numbers.push(i);


    }]);

})();