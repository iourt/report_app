angular.module('Huijm')

// 顶部菜单
.directive('headerBar', function (
    $state,
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/header_bar.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {
            // $rootScope.HeaderTab = 1;

            $scope.setHeader = function (e) {
                var $that = angular.element(e.delegationTarget),
                    menu  = $that.attr('data-menu');

                $rootScope.HeaderTab = menu;

                switch ($rootScope.HeaderTab) {
                    case "action":
                        $rootScope.HideSub = false;
                        $rootScope.MenuId = 1;
                    break;

                    case "base":
                        $rootScope.HideSub = true;
                        $rootScope.MenuId = 'base_data';
                        $state.go('report.base-data');
                    break;
                }
            };

            // 设置当前current
            // $scope.setCurrent = function (e) {
            //     var $that = angular.element(e.delegationTarget),
            //         $list = angular.element(document.querySelectorAll('.js_menu li'));

            //     $list.removeClass('current');

            //     $that.addClass('current');
            // };
            

            // widget.ajaxRequest({
            //     scope: $scope,
            //     url: 'getPageModel',
            //     data: {},
            //     success: function (data) {
            //         $scope.PageList = data;
            //     }
            // })
        }
    };
});