angular.module('Huijm')

// 筛选
.directive('filterBar', function (
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/filter_bar.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {
            // {
            //     type:
            //     id:
            //     name:
            // }
            if (!$scope.Filter) $scope.Filter = {};

            var callback = $attrs.callback ? $scope.$eval($attrs.callback) : function(){};

            $scope.Filter.Options = [];
            $scope.FilterPage = $attrs.type;
			
			$scope.resetFilter = function (e) {
				var $that = angular.element(e.delegationTarget);

                var text  = $that.attr('data-text'),
                    id    = $that.attr('data-id'),
                    type  = $that.attr('data-type');

                angular.forEach($scope.Filter.Options, function (v, k) {
                    if (v.type == type && v.id==id) {
                        $scope.Filter.Options.splice(k, 1);
                        var elem = $element.find('dd li');

                        angular.forEach(elem, function (item, key) {
                            var el = elem[key];
                            if (el.className=='current' && el.dataset['id']==id && el.dataset['text']==text && el.dataset['type']==type){
                                el.className = '';
                            }
                        });
                    }
                });

                $scope.Filter.Client = '';
			};

			$scope.setFilter = function (e) {
				var $that = angular.element(e.delegationTarget);

                var key,
                    state = false,
                    text  = $that.attr('data-text'),
                    id    = $that.attr('data-id'),
                    type  = $that.attr('data-type'),
                    obj   = {type: type, id: id, text: text};

                $that.parent().find('li').removeClass('current');
                $that.addClass('current');

                if ($scope.Filter.Options.length > 0) {
                    angular.forEach($scope.Filter.Options, function (v, k) {
                        if (v.type == type) {
                            key = k;
                            state = true;
                        }
                    });

                    if (state) {
                        $scope.Filter.Options[key] = obj;
                    } else {
                        $scope.Filter.Options.push(obj)
                    }
                } else {
                    $scope.Filter.Options.push({
                        type: type,
                        id: id,
                        text: text
                    });
                }

                if ($scope.Filter.Options.length > 0) {
                    $scope.Filter.Client = id;
                } else {
                    $scope.Filter.Client = '';
                }

                // callback();
			};
            //widget.ajaxRequest({
            //    scope: $scope,
            //    url: 'getPageModel',
            //    data: {},
            //    success: function (data) {
            //        $scope.PageList = data;
            //    }
            //})

            $scope.$watch('Filter.Client', function () {
                // callback();
            });
        }
    };
});
