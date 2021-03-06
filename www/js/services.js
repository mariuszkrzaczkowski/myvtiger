angular.module('myvtiger.services', [])

.factory('API', ['$http',
    function($http) {
        var _base = "/modules/Mobile/api.php";
        var _api = {
            login: function(user, vtigerurl) {
                return $http({
                    method: "POST",
                    url: vtigerurl + _base,
                    data: '_operation=loginAndFetchModules&username=' + user.username + '&password=' + user.password,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getList: function(name, session, vtigerurl) {
                return $http({
                    method: "POST",
                    url: vtigerurl + _base,
                    data: '_operation=listModuleRecords&module=' + name + '&_session=' + session,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getDetail: function(id, session, vtigerurl) {
                return $http({
                    method: "POST",
                    url: vtigerurl + _base,
                    data: '_operation=fetchRecordWithGrouping&record=' + id + '&_session=' + session,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
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
            createSession: function(key, data) {
                return $window.localStorage[key] = JSON.stringify(data);
            },
            getSession: function(key) {
                return JSON.parse($window.localStorage[key]);
            },
            deleteSession: function(key) {
                delete $window.localStorage[key];
                return true;
            },
            checkSession: function(key) {
                if ($window.localStorage[key]) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        return _sessionFactory;
    }
]);