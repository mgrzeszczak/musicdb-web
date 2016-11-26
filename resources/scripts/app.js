(function(){

    var COOKIE_NAME = 'musicdb_web';

    angular.module("application",['ngRoute','ngCookies','toastr']);

    angular.module("application").factory('loginService',['$cookieStore',function($cookieStore) {
        var login = null;
        var token = null;
        var role = null;
        var id = null;

        var cookie = $cookieStore.get(COOKIE_NAME);
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
            },
            isAdmin: function(){
                return role==='ADMIN';
            }
        }
    }]);
    angular.module("application").factory('httpRequest',function($http, loginService) {
        return {
            request: function(method, url, data) {
                var headers = {
                    'Content-Type': 'application/json'
                };
                if(loginService.isLoggedIn()) {
                    headers.AUTH_TOKEN = loginService.getToken();
                    headers.AUTH_LOGIN = loginService.getLogin();
                }
                return $http({
                    method: method,
                    url: url,
                    data: data,
                    headers: headers
                });
            }
        }
    });
})();