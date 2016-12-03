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
                    /*var now = new Date(),
                        // this will set the expiration to 12 months
                        exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
                    $cookies.put('someToken','blabla',{
                        expires: exp
                    });*/

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
            var baseUrl = 'http://164.132.63.49/musicdb/api';
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
                if (error.Status===403){
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
            }
        }
    });
})();