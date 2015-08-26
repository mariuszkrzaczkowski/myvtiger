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
                sf.createSession('user', data.result.login);
                sf.createSession('modules', data.result.modules);
                $location.path('/home');
                $rootScope.hideLoading();
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Invalid Credentials');
            })
        }
    }
])

.controller('HomeCtrl', ['$rootScope', '$scope', 'SessionFactory',
    function($rootScope, $scope, sf) {
        $scope.records = [];
        $rootScope.$on('load-home', function(event) {
            $scope.records = sf.getSession('modules');
        });
        $rootScope.$broadcast('load-home');
    }
])

.controller('ModuleCtrl', ['$rootScope', '$scope', 'SessionFactory', 'API', '$ionicModal',
    function($rootScope, $scope, sf, api, $ionicModal) {
        $scope.records = [];
        $rootScope.$on('load-records', function(event) {
            $rootScope.showLoading('Fetching Records..');
            var user = sf.getSession('user');
            var name = 'Accounts';
            api.getRecords(name, user.session).success(function(data) {
                $scope.records = data.result.records;
                $rootScope.hideLoading();
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Oops.. Something went wrong');
            });
        });
        $rootScope.$broadcast('load-records');
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
                $rootScope.$broadcast('load-records');
            }).error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Oops.. Something went wrong');
            });
        }
    }
]);