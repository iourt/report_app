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

            console.log($scope.$parent.Page);

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
                callback();
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

                callback();
			};
            //widget.ajaxRequest({
            //    scope: $scope,
            //    url: 'getPageModel',
            //    data: {},
            //    success: function (data) {
            //        $scope.PageList = data;
            //    }
            //})

            // $scope.$watch('Filter.Client', function () {
                // callback();
            // });
        }
    };
})

.directive('filterData', function (
    $window,
    $timeout,
    $rootScope,
    $ionicSideMenuDelegate,

    ShowTime,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        scope: {},
        templateUrl: 'common/directives/filter_data.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs, ngModel) {
            if (!ngModel) return;

            var time = new Date().getTime(),
                hide = $attrs.hide ? $attrs.hide : '';

            $scope.Tab = '';
            $scope.Child = {
                Tab: '',
                Show: false
            };

            $scope.Filter = {
                Tab: '',

                StartTime: ShowTime.getDay({time: time}).source,
                EndTime: ShowTime.getDay({time: time}).source,

                Time: 'today',
                TimeText: '今天',

                Cycle: 'day', // 周期
                CycleText: '按天',

                Client: '', // 客户端
                ClientText: '不限'
            };

            if (hide) {
                switch (hide) {
                    case '1':
                        $scope.hideToday = true;

                        $scope.Filter.StartTime = ShowTime.getDay({time: time, day: -1}).target;
                        $scope.Filter.EndTime = ShowTime.getDay({time: time, day: -1}).target;
                        $scope.Filter.Time = 'yesterday';
                        $scope.Filter.TimeText = '昨天';
                    break;

                    case '2':
                        $scope.hideToday = true;
                        $scope.hideYesterday = true;

                        $scope.Filter.StartTime = ShowTime.getDay({time: time, day: -7}).target;
                        $scope.Filter.EndTime = ShowTime.getDay({time: time, day: -1}).target;
                        $scope.Filter.Time = 'week';
                        $scope.Filter.TimeText = '最近7天';
                    break;
                }
            }

            // 显示筛选项
            $scope.showFilter = function (e) {
                var $that = angular.element(e.delegationTarget),
                    type  = $that.attr('data-type');

                $scope.Tab = type;
                $scope.Child.Show = true;
                $timeout(function () {
                    $scope.Child.Tab = type;
                }, 10);
            };

            $scope.hideFilter = function (e) {
                if (e.target.nodeName !== 'DIV') return;

                $scope.Child.Tab = '';
                $timeout(function () {
                    $scope.Child.Show = false;
                }, 210);
            };

            $scope.setFilter = function (e) {
                var $that = angular.element(e.delegationTarget),
                    type  = $that.attr('data-type');

                // alert($scope.Child.Tab);
                // $that.addClass('current');

                switch ($scope.Child.Tab) {
                    case 'time':
                        $scope.Filter.Time = type;
                        changeTime(type);
                        $scope.Filter.TimeText = $that.text();
                    break;

                    case 'cycle':
                        viewTime();
                        $scope.Filter.Cycle = type;
                        $scope.Filter.CycleText = $that.text();
                    break;

                    case 'client':
                        viewTime();
                        $scope.Filter.Client = (type == 'none') ? '' : type;
                        $scope.Filter.ClientText = $that.text();
                    break;
                }

                $scope.Child.Tab = '';
                $timeout(function () {
                    $scope.Child.Show = false;

                    if (type == 'custom') {
                        $ionicSideMenuDelegate.toggleRight();
                    }

                    ngModel.$setViewValue($scope.Filter);
                }, 210);
            };

            function changeTime(type) {
                switch (type) {
                    case 'today':
                        $scope.Filter.StartTime = ShowTime.getDay({time: time}).source;
                        $scope.Filter.EndTime = ShowTime.getDay({time: time}).source;
                    break;

                    case 'yesterday':
                        $scope.Filter.StartTime = ShowTime.getDay({time: time, day: -1}).target;
                        $scope.Filter.EndTime = ShowTime.getDay({time: time, day: -1}).target;
                    break;

                    case 'week':
                        $scope.Filter.StartTime = ShowTime.getDay({time: time, day: -7}).target;
                        $scope.Filter.EndTime = ShowTime.getDay({time: time, day: -1}).target;
                    break;

                    case 'month':
                        $scope.Filter.StartTime = ShowTime.getDay({time: time, day: -30}).target;
                        $scope.Filter.EndTime = ShowTime.getDay({time: time, day: -1}).target;
                    break;
                };
            }

            function viewTime() {
                if ($scope.Filter.Time == 'custom') {
                    $scope.Filter.StartTime = $attrs.start;
                    $scope.Filter.EndTime = $attrs.end;
                }
            }
        }
    };
})
