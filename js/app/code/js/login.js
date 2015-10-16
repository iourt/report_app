angular.module('Huijm')
.controller('tLogin', function (
    $http,
    $scope,
    $state,
    $rootScope,

    $ionicViewSwitcher,
    
    toJump,
    base64,
    widget
){
    $scope.tInput = {};

    if ($rootScope.UserInfo && $rootScope.UserInfo.Auth) {
        // $ionicViewSwitcher.nextDirection('none');
        // $state.go('report.index');
        toJump({
            router: 'report.index'
        });
    }

    $scope.toLogin = function () {
        if (!$scope.tInput.UserName) {
            widget.msgToast('请输入用户名！');
            return;
        }

        if (!$scope.tInput.Password) {
            widget.msgToast('请输入密码！')
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
                    
                    // $ionicViewSwitcher.nextDirection('none');                 
                    // $state.go('report.index');
                    toJump({
                        router: 'report.index'
                    });
                } else {
					if (res.msg) {
						widget.msgToast(res.msg);
					} else {
						widget.msgToast('登录失败！');
					}
				}
            }
        });
    };
});
