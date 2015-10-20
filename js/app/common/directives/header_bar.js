angular.module('Huijm')

.directive('headerBar', function (
    $state,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/header_bar.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {
            if (!$scope.Header) $scope.Header = {};

            $scope.Header.Title = $attrs.title || '';

            $scope.Header.RightText = $attrs.right ? $attrs.right.split('|')[0] : '';
            $scope.Header.Right = $attrs.right ? $scope.$eval($attrs.right.split('|')[1]) : '';
        }
    };
});