angular.module('myvtiger.services', [])

.factory('API', ['$http',
    function($http) {
        var _base = "http://localhost/vtiger/vt61/modules/Mobile/api.php";
        var _api = {
            login: function(user) {
                return $http({
                    method: "POST",
                    url: _base,
                    data: '_operation=login&username=' + user.username + '&password=' + user.password,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                // return $http.post(_base + '/modules/Mobile/api.php', dataObj);
            },
            getTodos: function(session) {
                return $http({
                    method: "POST",
                    url: _base,
                    data: '_operation=alertDetailsWithMessage&alertid=7&_session=' + session,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
                // return $http.get(_base + '/api/data/getTodos/' + userid);
            },
            saveTodo: function(todo) {
                return $http.post(_base + '/api/data/saveTodo', todo);
            }
        };
        return _api;
    }
])

.factory('SessionFactory', ['$window',
    function($window) {
        var _sessionFactory = {
            createSession: function(user) {
                return $window.localStorage.user = JSON.stringify(user);
            },
            getSession: function(user) {
                return JSON.parse($window.localStorage.user);
            },
            deleteSession: function() {
                delete $window.localStorage.user;
                return true;
            },
            checkSession: function() {
                if ($window.localStorage.user) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        return _sessionFactory;
    }
]);