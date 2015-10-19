'use strict';

angular.module('Huijm')

.directive('pageBack', function (
    $state,
    $window,
    $rootScope,
    $stateParams,
    $ionicHistory,
    $ionicViewSwitcher,
    widget
) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function () {
                widget.toBack();
            });
        }
    };
})


.directive('pageJump', function (
    $window,
    $state,
    $timeout,
    $rootScope,
    $stateParams,
    $ionicHistory,
    $ionicViewSwitcher
) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function (event) {
                if (!$rootScope.UserInfo.Auth) {
                    scope.showLogin();
                    return;
                };

                var direction = "forward";

                if (attrs.pageJump == "none") {
                    direction = "none";
                    // scope.$destroy();
                    scope.loadMore = {};
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                }
                
                var router = attrs.router,
                    options = attrs.options ? scope.$eval(attrs.options) : {};

                $ionicViewSwitcher.nextDirection(direction);

                // $ionicHistory.nextViewOptions({
                //     disableAnimate: true,
                //     disableBack: true
                // });

                $state.go(router, options, {
                    inherit: false
                });

            });
        }
    };
})

.service('toJump', function (
    $state,
    
    $ionicViewSwitcher
) {
    var toJump = function (params) {
        // if (!$rootScope.UserInfo.Auth) {
        //     $scope.showLogin();
        //     return;
        // };

        var direction = params.direction || 'none',
            router = params.router,
            options = params.options || {};

        $ionicViewSwitcher.nextDirection(direction);
        $state.go(router, options, { inherit: false });
    };

    return toJump;
});