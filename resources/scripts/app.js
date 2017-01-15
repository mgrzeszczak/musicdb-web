(function(){

    var COOKIE_NAME = 'musicdb_web';

    angular.module("application",['ngRoute','ngCookies','toastr']);

    angular.module("application").factory('cache',function(){

        var dict = {};

        var get = function(key){
            return dict[key];
        };

        var put = function(key,value){
          dict[key] = value;
        };

        return {
            put : put,
            get : get
        };
    });

    angular.module('application').factory('commentService',['http','toastr',function(http,toastr){

        return {
            getComments : function(id,type,page,onSuccess,onError){
                var url = '/comment/find?entityType='+type+'&entityId='+id;
                if (page!=undefined) url = url+"&pageNr="+page;
                http.get(url,onSuccess,onError);
            },
            deleteComment : function(id){
                http.delete('/comment/delete/'+id,function(success){
                    toastr.success('Comment deleted');
                }, function(error){
                    toastr.error('Failed to delete comment');
                });
            }
        };

    }]);

    angular.module("application").factory('loginService',['$cookieStore','$location',function($cookieStore,$location) {
        var login = null;
        var token = null;
        var role = null;
        var id = null;

        var cookie = $cookieStore.get(COOKIE_NAME);
        console.log(cookie);
        if(cookie) {
            login = cookie['login'];
            token = cookie['token'];
            role = cookie['role'];
            id = cookie['id'];
        }

        return {
            getLogin: function() {
                return login;
            },
            getToken: function() {
                return token;
            },
            isLoggedIn: function() {
                return !(login == null);
            },
            getRole: function() {
                return role;
            },
            logIn: function(data,remember) {
                login = data.login;
                token = data.token;
                role = data.role;
                id = data.id;
                if(remember === true) {

                    // TODO: cookie expiration date
                    var now = new Date(),
                        // this will set the expiration to 12 months
                        exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
                    /*$cookies.put('someToken','blabla',{
                        expires: exp
                    })*/
                    $cookieStore.put(COOKIE_NAME,{
                        login: login,
                        token: token,
                        id: id,
                        role: role,
                        expires : exp
                    });

                } else {
                    $cookieStore.put(COOKIE_NAME,{
                        login: login,
                        token: token,
                        id: id,
                        role: role
                    });
                }
            },
            logOut: function() {
                $cookieStore.remove(COOKIE_NAME);
                login = null;
                token = null;
                role = null;
                id = null;
                $location.path('/login');
            },
            isAdmin: function(){
                return role==='ADMIN';
            }
        }
    }]);
    angular.module("application").factory('http',function($http, loginService,toastr) {
        var request = function(method, url, data, onSuccess, onError) {
            var baseUrl = 'http://localhost:8080/api';
            var headers = {
                'Content-Type': 'application/json'
            };
            if(loginService.isLoggedIn()) {
                headers['AUTH-TOKEN'] = loginService.getToken();
                headers['AUTH-LOGIN'] = loginService.getLogin();
            }
            $http({
                method: method,
                url: baseUrl+url,
                data: JSON.stringify(data),
                headers: headers
            }).then(function(resp){
                onSuccess(resp);
            },function(error){
                if (error.status===403 && loginService.isLoggedIn()){
                  loginService.logOut();
                  toastr.error('You have been logged out!');
                } else onError(error);
            });
        };
        return {
            get : function(url,onSuccess,onError){
                request('GET',url,undefined,onSuccess,onError);
            },
            post : function(url,data,onSuccess,onError){
                request('POST',url,data,onSuccess,onError);
            },
            delete : function(url,onSuccess,onError){
                request('DELETE',url,undefined,onSuccess,onError);
            },
            put : function(url,data,onSuccess,onError){
                request('PUT',url,data,onSuccess,onError);
            },
            getErrorMessage : function(error){
                switch (error.data.ErrorCode){
                    case 'UNKNOWN_ERROR':
                        return 'Unknown error occured.';
                        break;
                    case 'ARTIST_NAME_TAKEN':
                        return 'Artist name is already taken.';
                        break;
                    case 'ALBUM_NAME_TAKEN':
                        return 'That artist already has an album with that name.';
                        break;
                    case 'SONG_TITLE_TAKEN':
                        return 'That album already has a song with that title.';
                        break;
                    case 'SONG_NUMBER_TAKEN':
                        return 'That album already has a song with that number.';
                        break;
                    case 'ALBUM_NUMBER_TAKEN':
                        return 'That artist already has an album with that number.';
                        break;
                    case 'INVALID_CREDENTIALS':
                        return 'Invalid credentials.';
                        break;
                    case 'NOT_FOUND':
                        return 'Object not found.';
                        break;
                    case 'INVALID_VERSION':
                        return 'Object was edited in the meantime.';
                        break;
                    case 'LOGIN_TAKEN':
                        return 'Login is taken.';
                        break;
                    case 'VALIDATION_FAILED':
                        return 'Invalid data.';
                        break;
                    case 'MULTIPLE_RATINGS':
                        return 'Unknown error occured.';
                        break;
                    case 'UNAUTHORIZED':
                        return 'You\'re not authorized to view that.';
                        break;
                }
            }
        }
    });
})();