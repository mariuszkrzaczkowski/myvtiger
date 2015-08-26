angular.module('myvtiger.controllers', [])

.controller('LoginCtrl', ['$rootScope', '$location', '$scope', 'API', 'SessionFactory',
    function($rootScope, $location, $scope, api, sf) {
        $scope.login = {
            username: '',
            password: ''
        }
        $scope.loginUser = function() {
            $rootScope.showLoading("Authenticating..");
            api.login($scope.login).success(function(data) {
                sf.createSession(data.result.login);
                $location.path('/home');
                $rootScope.hideLoading();
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Invalid Credentials');
            })
        }
    }
])

.controller('SignupCtrl', ['$rootScope', '$location', '$scope', 'API', 'SessionFactory',
    function($rootScope, $location, $scope, api, sf) {
        $scope.reg = {
            username: '',
            password: ''
        }
        $scope.registerUser = function() {
            $rootScope.showLoading("Authenticating..");
            api.signup($scope.reg).success(function(data) {
                sf.createSession(data.data);
                $location.path('/home');
                $rootScope.hideLoading();
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Invalid Credentials');
            })
        }
    }
])

.controller('HomeCtrl', ['$rootScope', '$scope', 'SessionFactory', 'API', '$ionicModal',
    function($rootScope, $scope, sf, api, $ionicModal) {
        $scope.todos = [];
        $rootScope.$on('load-todos', function(event) {
            $rootScope.showLoading('Fetching Todos..');
            var login = sf.getSession();
            api.getTodos(login.session).success(function(data) {
                $scope.todos = data.data;
                $rootScope.hideLoading();
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Oops.. Something went wrong');
            });
        });
        $rootScope.$broadcast('load-todos');
        $rootScope.createNew = function() {
            $scope.modal.show();
        }
        $ionicModal.fromTemplateUrl('modal2.html', function(modal) {
            $scope.modal = modal;
        }, {
            animation: 'slide-in-up',
            focusFirstInput: true
        });
    }
])

.controller('NewTodoCtrl', ['$rootScope', '$scope', 'SessionFactory', 'API',
    function($rootScope, $scope, sf, api) {
        $scope.todo = {
            item: ''
        };
        $scope.create = function() {
            api.saveTodo({
                todo: $scope.todo.item,
                userid: sf.getSession()._id
            }).success(function(data) {
                $rootScope.hideLoading();
                $scope.modal.hide();
                $rootScope.$broadcast('load-todos');
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Oops.. Something went wrong');
            });
        }
    }
]);