angular.module('Huijm')

.directive('tabIndex', function (
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/tab_index.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {

            if (!$scope.Page) $scope.Page = {};

            $scope.Page.CheckType = 'pv';
            $scope.Page.CheckText = '浏览量(PV)';

            // 设置回调函数
            var callback = $attrs.callback ? $scope.$eval($attrs.callback) : function(){};

            $scope.setTab = function (e) {
                var $that = angular.element(e.delegationTarget);

                $scope.Page.CheckType = $that.attr('data-type');
                $scope.Page.CheckText = $that.text();

                // $scope.getData();
                callback();
            };

        }
    };
})


/**
 * 详情页 筛选项
 * PV、UV、IP......
 */
.directive('tabDetail', function (
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/tab_detail.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {

            if (!$scope.Page) $scope.Page = {};

            $scope.Page.CheckType = 'pv';
            $scope.Page.CheckText = '浏览量(PV)';

            // 设置回调函数
            var callback = $attrs.callback ? $scope.$eval($attrs.callback) : function(){};

            $scope.setTab = function (e) {
                var $that = angular.element(e.delegationTarget);

                $scope.Page.CheckType = $that.attr('data-type');
                $scope.Page.CheckText = $that.text();

                callback();
            };

        }
    };
})



/**
 * 基础数据，数据概况 筛选项
 * 激活用户
 */
.directive('tabData', function (
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/tab_data.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {

            if (!$scope.Page) $scope.Page = {};

            $scope.Page.CheckType = '1';
            $scope.Page.CheckText = '激活用户';

            // 设置回调函数
            var callback = $attrs.callback ? $scope.$eval($attrs.callback) : function(){};

            $scope.setTab = function (e) {
                var $that = angular.element(e.delegationTarget);

                $scope.Page.CheckType = $that.attr('data-type');
                $scope.Page.CheckText = $that.text();

                callback();
            };

        }
    };
})


/**
 * 时间切换
 * today、yesterday、week、month......
 */
.directive('tabTime', function (
    $window,
    $rootScope,
    $stateParams,
    widget,
    ShowTime
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/tab_time.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {

            if (!$scope.Page) $scope.Page = {};
            if (!$scope.Filter) $scope.Filter = {};

            switch ($stateParams.type) {
                case 'yesterday':
                    $scope.Page.TimeType = 'yesterday';
                    $scope.Page.TimeText = '昨天';
                break;

                case 'week':
                    $scope.Page.TimeType = 'week';
                    $scope.Page.TimeText = '最近7天';
                break;

                case 'month':
                    $scope.Page.TimeType = 'month';
                    $scope.Page.TimeText = '最近30天';
                break;

                default:
                    $scope.Page.TimeType = 'today';
                    $scope.Page.TimeText = '今天';
            }

            var hide = $attrs.hide ? $attrs.hide : '';

            if (hide) {
                switch (hide) {
                    case '1':
                        $scope.hideToday = true;
                        $scope.Page.TimeType = 'yesterday';
                        $scope.Page.TimeText = '昨天';
                    break;

                    case '2':
                        $scope.hideToday = true;
                        $scope.hideYesterday = true;
                        $scope.Page.TimeType = 'week';
                        $scope.Page.TimeText = '最近7天';
                    break;
                }
            }

            // 设置回调函数
            var callback = $attrs.callback ? $scope.$eval($attrs.callback) : function(){};

            // 日历更改数据更新调用
            $scope.$watch('Page.Calendar', function () {
                if ($scope.Page.Calendar) {
                    $scope.Page.StartTime = $scope.Page.Calendar.prev;
                    $scope.Page.EndTime   = $scope.Page.Calendar.next || $scope.Page.Calendar.prev;

                    $scope.Page.TimeType = 'calendar';
                    // $scope.Page.TimeText = $scope.Page.Calendar.next ? $scope.Page.Calendar.prev+'~'+$scope.Page.Calendar.next : $scope.Page.Calendar.prev;
                    // $scope.Page.TimeText = $scope.Page.Calendar.next ? $scope.Page.StartTime+'~'+$scope.Page.EndTime : $scope.Page.StartTime;
                    $scope.Page.TimeText = ($scope.Page.StartTime == $scope.Page.EndTime) ? $scope.Page.StartTime : $scope.Page.StartTime+'~'+$scope.Page.EndTime;
                    
                    callback();
                }
            });

            // 显示设置
            if ($attrs.right == 'show') {
                $scope.tShowtType = true;
            } else {
                $scope.tShowtType = false;
            }

            if ($attrs.mid == 'show') {
                $scope.tShowCalendar = true;
            } else {
                $scope.tShowCalendar = false;
            }
            
            /**
             * 根据点击选择的时间段来转换时间
             * today,yesterday,week,month
             */
            $scope.setTime = function (e) {
                var $that = angular.element(e.delegationTarget);

                $scope.Page.TimeType = $that.attr('data-type');
                $scope.Page.TimeText = $that.text();

                switch ($scope.Page.TimeType) {
                    case 'today':
                        $scope.Page.StartTime = ShowTime.getDay({
                            time: $scope.Page.Time
                        }).source;
                        $scope.Page.EndTime = ShowTime.getDay({
                            time: $scope.Page.Time
                        }).source;
                    break;

                    case 'yesterday':
                        $scope.Page.StartTime = ShowTime.getDay({
                            time: $scope.Page.Time,
                            day: -1
                        }).target;
                        $scope.Page.EndTime = ShowTime.getDay({
                            time: $scope.Page.Time,
                            day: -1
                        }).target;
                    break;

                    case 'week':
                        $scope.Page.StartTime = ShowTime.getDay({
                            time: $scope.Page.Time,
                            day: -6
                        }).target;
                        $scope.Page.EndTime = ShowTime.getDay({
                            time: $scope.Page.Time,
                            day: -6
                        }).source;
                    break;

                    case 'month':
                        $scope.Page.StartTime = ShowTime.getDay({
                            time: $scope.Page.Time,
                            day: -29
                        }).target;
                        $scope.Page.EndTime = ShowTime.getDay({
                            time: $scope.Page.Time,
                            day: -29
                        }).source;
                    break;
                };

                callback();
            };

            $scope.setTimeFilter = function (e) {
                var $that = angular.element(e.delegationTarget),
                    type  = $that.attr('data-type');

                if ($scope.Filter.TimeType != type) {
                    $scope.Filter.TimeType = $that.attr('data-type');
                    callback();
                }
            };

        }
    };
})


/**
 * 视图切换
 * 视图报表、文字报表（photo、text）
 */
.directive('tabView', function (
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/tab_view.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs) {

            if (!$rootScope.View) $rootScope.View = 'word';
            changeview();

            // 设置回调函数
            var callback = $attrs.callback ? $scope.$eval($attrs.callback) : function(){};

            $scope.setView = function (e) {
                var $that = angular.element(e.delegationTarget);

                $rootScope.View = $that.attr('data-type');

                changeview();
                
                if ($attrs.menu == 'show') {
                    if ($rootScope.View == 'word') {
                        $element.find('div').css('display', '-webkit-box');
                    } else {
                        $element.find('div').css('display', 'none');
                    }
                }

                // $scope.getData();
                callback();
            };

            $scope.setExport = function (e) {
                widget.msgToast('功能开发中......');
            };

            function changeview() {
                if ($rootScope.isHybrid && $rootScope.View == 'photo') window.screen.lockOrientation('landscape');
                if ($rootScope.isHybrid && $rootScope.View == 'word') window.screen.lockOrientation('portrait');
            }
        }
    };
});