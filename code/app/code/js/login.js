Huijm
.controller('tLogin', function (
    $http,
    $scope,
    $state,
    $rootScope,
    base64,
    widget
){
    $rootScope.showHeader = false;
    $rootScope.HideSub    = false;
    $rootScope.HeaderTab  = '';
    $rootScope.MenuId     = '';

    $scope.tInput = {};

    if ($rootScope.UserInfo && $rootScope.UserInfo.Auth) {
        $state.go('report.base-data');
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
                                        
                    $state.go('report.base-data');
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
