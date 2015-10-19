angular.module('Huijm')

.directive('showLogin', function (
    $state,
    $window,
    $timeout,
    $compile,
    $rootScope,
    $ionicViewSwitcher,
    
    base64,
    widget
) {

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/show_login.html',
        controller: function ($scope, $element, $attrs) {

            $scope.tInput = {}; //初始化ng-model

            $scope.closeLogin = function () {
                $element.removeClass("this_show");
            };

            $scope.showLogin = function () {
                var $that = $element.css("display", "block");
                
                $timeout( function () {
                    $element.addClass('this_show');
                }, 50);
            };

            //去登录
            $scope.toLogin = function () {
                if (!$scope.tInput.UserName) {
                    widget.msgToast('请输入用户名');
                    return;
                }

                if (!$scope.tInput.Password) {
                    widget.msgToast('请输入密码');
                    return;
                }

                widget.ajaxRequest({
                    scope: $scope,
                    url: 'account/login',
                    data: {
                        username: $scope.tInput.UserName,
                        password: $scope.tInput.Password
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            widget.setLogin({
                                UserName: $scope.tInput.UserName,
                                Auth: base64.encode($scope.tInput.UserName + ':' + $scope.tInput.Password)
                            });

                            $scope.closeLogin();

                            $timeout(function (){
                                $element.css("display", "none");
                            }, 300);
                        } else {
                            if (res.msg) {
                                widget.msgToast(res.msg);
                            } else {
                                widget.msgToast('登录失败！');
                            }
                        }
                    },
                    error: function () {
                        widget.msgToast('登录失败');
                    }
                });
                
            };
        }
    };
});
