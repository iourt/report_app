/**
 * 日历控件
 * 调用方式:
 * <calendar ng-model="*"></calendar>
 * ng-model中填的就是你要抛出去的日历值，必填 
 */
angular.module('Huijm')

.directive('calendar', function (
    $timeout,
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        require: '^ngModel',
        scope: {},
        templateUrl: 'common/directives/calendar.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs, ngModel) {
            if (!ngModel) return;

            // ngModel.$render = function() {
            //     alert(2);
            // };

            var date = new Date();

            $scope.DateDay = []; // 日历数据
            $scope.Calendar = {
                year:   date.getFullYear(), //--选择的年
                month:  date.getMonth(), //-----选择的月
                day:    date.getDate(), //------选择的天
                iyear:  date.getFullYear(), //--当前年
                imonth: date.getMonth(), //-----当前月
                iday:   date.getDate(), //------当前天

                error:  '', //------------------日期选择错误提示文本
                show:   false, //---------------日历是否显示的状态
                date:   '' //-------------------显示的就是选择好的日期
            };
            $scope.Calendar.input = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day

            function isLeap(year) {
                return (year%100==0 ? res=(year%400==0 ? 1 : 0) : res=(year%4==0 ? 1 : 0));
            }

            // 生成日历数据
            $scope.setCalendar = function () {
                var firstday = new Date($scope.Calendar.year, $scope.Calendar.month, 1).getDay(), //--------------计算月份的第一天星期几
                    monthDay = [31, 28+isLeap($scope.Calendar.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //--各个月份的总天数
                    line     = Math.ceil((monthDay[$scope.Calendar.month] + firstday) / 7); //--------------------日历显示多少行
                
                var x, //--------单元格自然序列号
                    dateNum; //--计算日期

                $scope.DateDay = new Array(line); // 日历数据 new Array() 根据行数

                if ($scope.Calendar.month == 0) {
                    var last = monthDay[11];
                } else {
                    var last = monthDay[$scope.Calendar.month-1];
                }

                for (var i=0; i<line; i++) {
                    $scope.DateDay[i] = [];

                    for (var k=0; k<7; k++) {
                        var dayData = {class: '', day: ''};

                        x = i*7 + k; // 单元格自然序列号
                        dateNum = x - firstday + 1; // 计算日期

                        if (dateNum <= 0) {
                            dayData = {
                                class: 'disable',
                                day: last-firstday+k+1
                            };
                        } else if (dateNum > monthDay[$scope.Calendar.month]) {
                            dayData = {
                                class: 'disable',
                                day: dateNum-monthDay[$scope.Calendar.month]
                            }
                        } else {
                            dayData = {
                                class: '',
                                day: dateNum
                            }
                        }

                        if (dateNum == $scope.Calendar.iday && $scope.Calendar.year == $scope.Calendar.iyear && $scope.Calendar.month == $scope.Calendar.imonth) {
                            dayData.class = 'today';
                        }

                        if (dateNum == $scope.Calendar.day) {
                            dayData.class = 'select';
                        }

                        $scope.DateDay[i].push(dayData);
                    }
                }

                // $scope.Calendar.show = true;
                angular.element($element).find('.js_calendar').css('display', 'block');

            };

            // 显示日历，并对提交的时间处理日期
            $scope.showCalendar = function (e) {
                if (!e) return;

                angular.element(document.querySelector('body')).find('.js_calendar').css('display', 'none');

                if ($scope.Calendar.date) {
                    var arr = $scope.Calendar.date.split('-');

                    $scope.Calendar.year  = arr[0];
                    $scope.Calendar.month = arr[1]-1;
                    $scope.Calendar.day   = arr[2];
                    $scope.Calendar.input = arr[0] +'-'+ arr[1] +'-'+ arr[2];
                }
                $scope.setCalendar();
            };

            // 选择日历中的某个日期
            $scope.chooseCalendar = function (e) {
                var $that = angular.element(e.delegationTarget),
                    text  = parseInt($that.text(), 0);

                if ($that.hasClass('disable')) return;

                angular.forEach($scope.DateDay, function (v) {
                    angular.forEach(v, function (n) {
                        if (n.class == 'disable') return;
                        n.class = (n.day == text) ? 'select' : '';
                    });
                });

                // 改变选择的日期
                $scope.Calendar.day = parseInt($that.text(), 0);

                $scope.setmpCalendar();
            };

            // 点击确定按钮
            $scope.submitCalendar = function () {
                var data = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day;

                // $scope.Calendar.show = false;
                angular.element($element).find('.js_calendar').css('display', 'none');

                $scope.Calendar.date = data;
                ngModel.$setViewValue(data);
            };

            // 点击取消按钮
            $scope.cancleCalendar = function () {
                // $scope.Calendar.show = false;
                angular.element(document.querySelector('body')).find('.js_calendar').css('display', 'none');
                // $scope.CalendarDate = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day;
            };

            // 改变年份
            $scope.changeYear = function (type) {
                if (type == 'next') {
                    $scope.Calendar.year++;
                } else {
                    $scope.Calendar.year--;
                }

                $scope.setmpCalendar();
                $scope.setCalendar();
            };

            // 改变月份
            $scope.changeMonth = function (type) {
                if (type == 'next') {
                    if ($scope.Calendar.month == 11) {
                        $scope.Calendar.year++;
                        $scope.Calendar.month = 0;
                    } else {
                        $scope.Calendar.month++;
                    }
                } else {
                    if ($scope.Calendar.month == 0) {
                        $scope.Calendar.year--;
                        $scope.Calendar.month = 11;
                    } else {
                        $scope.Calendar.month--;
                    }
                }

                $scope.setmpCalendar();
                $scope.setCalendar();
            };

            // 改变临时input日期显示
            $scope.setmpCalendar = function () {
                $scope.Calendar.input = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day;
            };
        }
    };
});