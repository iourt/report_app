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
    $rootScope,
    $stateParams,
    $ionicHistory,
    $ionicViewSwitcher
) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function (event) {
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
});