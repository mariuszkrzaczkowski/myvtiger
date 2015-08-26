angular.module('myvtiger.controllers', [])

.controller('NavCtrl', ['$rootScope', '$scope',
    function($rootScope, $scope) {
        $scope.goBack = function() {
            window.history.back();
        };
    }
])

.controller('LoginCtrl', ['$rootScope', '$location', '$scope', 'API', 'SessionFactory',
    function($rootScope, $location, $scope, api, sf) {
        $scope.login = {
            username: '',
            password: ''
        };
        $scope.loginUser = function() {
            $rootScope.showLoading("Authenticating..");
            api.login($scope.login)
            .success(function(data) {
                sf.createSession('user', data.result.login);
                sf.createSession('modules', data.result.modules);
                $location.path('/home');
                $rootScope.hideLoading();
            })
            .error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Invalid Credentials');
            });
        };
    }
])

.controller('HomeCtrl', ['$rootScope', '$scope', 'SessionFactory',
    function($rootScope, $scope, sf) {
        $scope.modules = [];
        $rootScope.$on('load-home', function(event) {
            $scope.modules = sf.getSession('modules');
        });
        $rootScope.$broadcast('load-home');
    }
])

.controller('ListCtrl', ['$rootScope', '$stateParams', '$scope', 'SessionFactory', 'API', '$ionicModal',
    function($rootScope, $stateParams, $scope, sf, api, $ionicModal) {
        $scope.records = [];
        $rootScope.$on('load-list', function(event) {
            var user = sf.getSession('user');
            var name = $stateParams.moduleName;
            if(sf.checkSession(name)) {
                $scope.list = sf.getSession(name);
            } else {
                $rootScope.showLoading('Fetching Records..');
                api.getList(name, user.session)
                .success(function(data) {
                    $scope.list = data.result.records;
                    sf.createSession(name, data.result.records);
                    $rootScope.hideLoading();
                })
                .error(function(data) {
                    $rootScope.hideLoading();
                    $rootScope.toast('Oops.. Something went wrong');
                });
            }
        });
        $rootScope.$broadcast('load-list');
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

.controller('DetailCtrl', ['$rootScope', '$stateParams', '$scope', 'SessionFactory', 'API',
    function($rootScope, $stateParams, $scope, sf, api) {
        $scope.detail = [];
        $rootScope.$on('load-detail', function(event) {
            $rootScope.showLoading('Fetching Detail..');
            var user = sf.getSession('user');
            var id = $stateParams.recordId;
            api.getDetail(id, user.session)
            .success(function(data) {
                $scope.detail = data.result.record;
                $rootScope.hideLoading();
            })
            .error(function(data) {
                $rootScope.hideLoading();
                $rootScope.toast('Oops.. Something went wrong');
            });
        });
        $rootScope.$broadcast('load-detail');
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