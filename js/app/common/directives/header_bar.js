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
            console.log($attrs.title);
            if ($scope.Page) $scope.Page = {};

            $scope.Page.Title = $attrs.title || '';
        }
    };
});