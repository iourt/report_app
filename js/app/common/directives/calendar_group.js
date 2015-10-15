/**
 * 日历控件
 * 调用方式:
 * <calendar-group ng-model="*"></calendar-group>
 * ng-model中填的就是你要抛出去的日历值，必填 
 */
angular.module('Huijm')

.directive('calendarGroup', function (
    $timeout,
    $window,
    $rootScope,
    widget,
    ShowTime
) {
    return {
        restrict: 'E',
        replace: true,
        require: '^ngModel',
        scope: {},
        templateUrl: 'common/directives/calendar_group.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs, ngModel) {
            if (!ngModel) return;

            // ngModel.$render = function() {
            //     alert(2);
            // };
            angular.element(document.querySelector('#js_view')).on('click', function (e) {
                var $that = $(e.target).closest('.t_calendar');

                if (!$that.length) {
                    $scope.$apply(function () {
                        $scope.iShowCalendar = false;
                    });
                }
            });

            var date = new Date();

            /**
             * 日历数据
             * 上下两个月
             */
            $scope.CalendarList = new Array(2); // 日历数据

            $scope.Calendar = {
                pyear:  date.getFullYear(), //--选择好的日期开始时间
                pmonth: date.getMonth(), //-----选择好的日期开始时间
                pday:   date.getDate(), //------选择好的日期开始时间

                nyear:  '', //------------------选择好的日期结束时间
                nmonth: '', //------------------选择好的日期结束时间
                nday:   '', //------------------选择好的日期结束时间

                iyear:  date.getFullYear(), //--当前年
                imonth: date.getMonth(), //-----当前月
                iday:   date.getDate(), //------当前天

                error:  '', //------------------日期选择错误提示文本
                show:   false, //---------------日历是否显示的状态
                date:   '', //------------------显示的就是选择好的日期

                detail: [], //------------------这是日历开始月份

                prevDate: '', //----------------选择的开始日期(临时)
                nextDate: '' //-----------------选择的结束日期(临时)
            };
            $scope.Calendar.prevDate = $scope.Calendar.pyear +'-'+ ($scope.Calendar.pmonth+1) +'-'+ $scope.Calendar.pday;
            $scope.Calendar.detail   = [$scope.Calendar.pyear, $scope.Calendar.pmonth];

            function isLeap(year) {
                return (year%100==0 ? res=(year%400==0 ? 1 : 0) : res=(year%4==0 ? 1 : 0));
            }

            // 生成日历数据
            $scope.setCalendar = function () {
                for (var item=0; item<2; item++) {
                    var arr,
                        year  = $scope.Calendar.detail[0],
                        month = $scope.Calendar.detail[1];

                    if (item == 1) {
                        var tmp = ShowTime.getDate(year, month, 2);

                        year  = tmp.next.year;
                        month = tmp.next.month;
                    }


                    var firstday = new Date(year, month, 1).getDay(), //------------------------------计算月份的第一天星期几
                        monthDay = [31, 28+isLeap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //--各个月份的总天数
                        line     = Math.ceil((monthDay[month] + firstday) / 7); //--------------------日历显示多少行
            
                    var x, //--------单元格自然序列号
                        dateNum; //--计算日期

                    $scope.CalendarList[item] = new Array(line); // 日历数据 new Array() 根据行数


                    if (month == 0) {
                        var last = monthDay[11];
                    } else {
                        var last = monthDay[month-1];
                    }

                    for (var i=0; i<line; i++) {
                        $scope.CalendarList[item][i] = [];

                        for (var k=0; k<7; k++) {
                            var dayData = {
                                    class: '',
                                    year: year,
                                    month: month+1,
                                    day: ''
                                };

                            x = i*7 + k; // 单元格自然序列号
                            dateNum = x - firstday + 1; // 计算日期

                            if (dateNum <= 0) {
                                dayData.class = 'disable';
                                dayData.year  = ShowTime.getDate(year, month).prev.year;
                                dayData.month = ShowTime.getDate(year, month).prev.month;
                                dayData.day   = last - firstday + k + 1;
                            } else if (dateNum > monthDay[month]) {
                                dayData.class = 'disable';
                                dayData.year  = ShowTime.getDate(year, month).next.year;
                                dayData.month = ShowTime.getDate(year, month).next.month;
                                dayData.day   = dateNum - monthDay[month];
                            } else {
                                dayData.class = '';
                                dayData.day   = dateNum;
                            }

                            if (dateNum == $scope.Calendar.iday && year == $scope.Calendar.iyear && month == $scope.Calendar.imonth) {
                                dayData.class = 'select';
                            }

                            // if (dateNum == $scope.Calendar.day) {
                            //     dayData.class = 'select';
                            // }
                            var tmpDate;
                            if ($scope.Calendar.nextDate) {
                                tmpDate = $scope.Calendar.nextDate.split('-');
                            } else {
                                tmpDate = $scope.Calendar.prevDate.split('-');
                            }
                            currentClass({
                                year: tmpDate[0],
                                month: tmpDate[1],
                                day: tmpDate[2]
                            });

                            $scope.CalendarList[item][i].push(dayData);
                        }
                    }
                }

                // $scope.Calendar.show = true;
                // angular.element($element).find('.js_calendar').css('display', 'block');
                $scope.iShowCalendar = true;

            };

            // 显示日历，并对提交的时间处理日期
            $scope.showCalendar = function (e) {
                if (!e) return;

                // angular.element(document.querySelector('body')).find('.js_calendar').css('display', 'none');
                $scope.iShowCalendar = false;


                // if ($scope.Calendar.date) {
                //     var arr = $scope.Calendar.date.split('-');

                //     $scope.Calendar.year  = arr[0];
                //     $scope.Calendar.month = arr[1]-1;
                //     // $scope.Calendar.day   = arr[2];
                //     $scope.Calendar.input = arr[0] +'-'+ arr[1] +'-'+ arr[2];
                // }

                $scope.Calendar.prevDate = $scope.Calendar.pyear +'-'+ ($scope.Calendar.pmonth+1) +'-'+ $scope.Calendar.pday;

                if ($scope.Calendar.nyear) {
                    $scope.Calendar.nextDate = $scope.Calendar.nyear +'-'+ ($scope.Calendar.nmonth+1) +'-'+ $scope.Calendar.nday;
                } else {
                    $scope.Calendar.nextDate = '';
                }

                $scope.setmpCalendar();
                
                $scope.setCalendar();
            };

            // 选择日历中的某个日期
            $scope.chooseCalendar = function (e) {
                var $that = angular.element(e.delegationTarget),
                    flag  = false; 

                if ($that.hasClass('disable')) return;

                var year  = parseInt($that.attr('data-year'), 0),
                    month = parseInt($that.attr('data-month'), 0),
                    day   = parseInt($that.attr('data-day'), 0),
                    tmp   = year +'-'+ month +'-'+ day;

                if (!$scope.Calendar.prevDate) {
                    
                    $scope.Calendar.prevDate = tmp;

                } else if ($scope.Calendar.prevDate) {

                    var prev    = $scope.Calendar.prevDate,
                        arrPrev = $scope.Calendar.prevDate.split('-');

                    if ($scope.Calendar.nextDate) {

                        $scope.Calendar.prevDate = tmp;
                        $scope.Calendar.nextDate = '';

                    } else {
                        
                        if (parseInt(arrPrev[0], 0) > year) {
                            $scope.Calendar.nextDate = prev;
                            $scope.Calendar.prevDate = tmp;
                        } else if (parseInt(arrPrev[0], 0) < year) {
                            $scope.Calendar.nextDate = tmp;
                        } else {
                            if (parseInt(arrPrev[1], 0) > month) {
                                $scope.Calendar.nextDate = prev;
                                $scope.Calendar.prevDate = tmp;
                            } else if (parseInt(arrPrev[1], 0) < month) {
                                $scope.Calendar.nextDate = tmp;
                            } else {
                                if (parseInt(arrPrev[2], 0) > day) {
                                    $scope.Calendar.nextDate = prev;
                                    $scope.Calendar.prevDate = tmp;
                                } else if (parseInt(arrPrev[2], 0) < day) {
                                    $scope.Calendar.nextDate = tmp;
                                }
                            }
                        }

                    }
                }

                // 改变选择的日期
                // $scope.Calendar.day = parseInt($that.text(), 0);
                currentClass({
                    year: year,
                    month: month,
                    day: day
                });

                $scope.setmpCalendar();
            };


            // 点击确定按钮
            $scope.submitCalendar = function () {
                // var data = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day;
                // var data = {
                //         prev: $scope.Calendar.prevDate,
                //         next: $scope.Calendar.nextDate
                //     };

                var data = {
                        prev: ShowTime.getFormatDate($scope.Calendar.prevDate),
                        next: $scope.Calendar.nextDate ? ShowTime.getFormatDate($scope.Calendar.nextDate) : ShowTime.getFormatDate($scope.Calendar.prevDate)
                    };

                // $scope.Calendar.show = false;
                // angular.element($element).find('.js_calendar').css('display', 'none');
                $scope.iShowCalendar = false;

                var prev = $scope.Calendar.prevDate.split('-');
                $scope.Calendar.pyear  = prev[0];
                $scope.Calendar.pmonth = parseInt(prev[1], 0) - 1;
                $scope.Calendar.pday   = prev[2];

                if ($scope.Calendar.nextDate) {
                    var next = $scope.Calendar.nextDate.split('-');

                    $scope.Calendar.nyear  = next[0];
                    $scope.Calendar.nmonth = parseInt(next[1], 0) - 1;
                    $scope.Calendar.nday   = next[2];
                } else {
                    $scope.Calendar.nyear  = '';
                    $scope.Calendar.nmonth = '';
                    $scope.Calendar.nday   = '';
                }

                $scope.Calendar.detail = [$scope.Calendar.pyear, $scope.Calendar.pmonth];

                $scope.Calendar.date = $scope.Calendar.input;
                ngModel.$setViewValue(data);
            };


            // 点击取消按钮
            $scope.cancleCalendar = function () {
                $scope.Calendar.detail = [$scope.Calendar.pyear, $scope.Calendar.pmonth];

                // $scope.Calendar.show = false;
                // angular.element(document.querySelector('body')).find('.js_calendar').css('display', 'none');
                $scope.iShowCalendar = false;
                // $scope.CalendarDate = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day;
            };


            // 改变年份
            $scope.changeYear = function (type) {
                var arr = $scope.Calendar.detail;

                if (type == 'next') {
                    $scope.Calendar.detail[0] = parseInt(arr[0], 0) + 1;
                } else {
                    $scope.Calendar.detail[0] = parseInt(arr[0], 0) - 1;
                }

                $scope.setCalendar();
            };


            // 改变月份
            $scope.changeMonth = function (type) {
                var arr = $scope.Calendar.detail;

                if (type == 'next') {
                    if (parseInt(arr[1], 0) == 11) {
                        $scope.Calendar.detail = [parseInt(arr[0], 0)+1, 0];
                    } else {
                        $scope.Calendar.detail = [arr[0], parseInt(arr[1], 0)+1];
                    }
                } else {
                    if (parseInt(arr[1], 0) == 0) {
                        $scope.Calendar.detail = [parseInt(arr[0], 0)-1, 11];
                    } else {
                        $scope.Calendar.detail = [arr[0], parseInt(arr[1], 0)-1];
                    }
                }

                $scope.setCalendar();
            };

            // 改变临时input日期显示
            $scope.setmpCalendar = function () {
                // $scope.Calendar.input = $scope.Calendar.year +'-'+ ($scope.Calendar.month+1) +'-'+ $scope.Calendar.day;
                // if ($scope.Calendar.prevDate) {
                //     if ($scope.Calendar.nextDate) {
                //         $scope.Calendar.input = $scope.Calendar.prevDate +' ~ '+ $scope.Calendar.nextDate;
                //     } else {
                //         $scope.Calendar.input = $scope.Calendar.prevDate;
                //     }
                // } else {
                //     $scope.Calendar.input = '';
                // }


                var prev = ShowTime.getFormatDate($scope.Calendar.prevDate),
                    next = $scope.Calendar.nextDate ? ShowTime.getFormatDate($scope.Calendar.nextDate) : '';

                if (prev) {
                    if (next) {
                        $scope.Calendar.input = prev +' ~ '+ next;
                    } else {
                        $scope.Calendar.input = prev;
                    }
                } else {
                    $scope.Calendar.input = '';
                }
            };


            /**
             * 日历选择式样
             * @params:
             *     year:
             *     month:
             *     day:
             */
            function currentClass(params) {
                var year  = params.year,
                    month = params.month,
                    day   = params.day;

                var flag = false, // 选择的时间是否为区间
                    prevArr = $scope.Calendar.prevDate.split('-'),
                    nextArr;

                if ($scope.Calendar.nextDate) {
                    flag = true;
                    nextArr = $scope.Calendar.nextDate.split('-');
                }

                angular.forEach($scope.CalendarList, function (item, key) {
                    angular.forEach(item, function (n) {
                        angular.forEach(n, function (v, k) {
                            if (v.class == 'disable') return;
                            
                            v.class = '';
                            
                            if (!flag) {
                                if (v.year == year && v.month == month && v.day == day) {
                                    v.class = 'select';
                                }
                            } else {
                                if (v.year < parseInt(prevArr[0], 0) || v.year > parseInt(nextArr[0], 0)) return;

                                if (parseInt(prevArr[0], 0) == parseInt(nextArr[0], 0)) { // 同年
                                    if (v.month < parseInt(prevArr[1], 0) || v.month > parseInt(nextArr[1], 0)) return;

                                    if (parseInt(prevArr[1], 0) == parseInt(nextArr[1], 0)) { // 同月
                                        if (v.day < parseInt(prevArr[2], 0) || v.day > parseInt(nextArr[2], 0)) return;

                                        v.class = 'select';
                                    } else { // 不同月份
                                        if (v.month > parseInt(prevArr[1], 0)) {
                                            if (v.month == parseInt(nextArr[1], 0)) {
                                                if (v.day > parseInt(nextArr[2], 0)) return;

                                                v.class = 'select';
                                            } else {
                                                v.class = 'select';
                                            }
                                        } else {
                                            if (v.day < parseInt(prevArr[2], 0)) return;

                                            v.class = 'select';
                                        }
                                    }

                                } else { // 不同年，上小于下

                                    if (v.year == parseInt(prevArr[0], 0)) { // 选择的年等于上个年
                                        
                                        if (v.month < parseInt(prevArr[1], 0)) return;

                                        if (v.month > parseInt(prevArr[1], 0)) {
                                            v.class = 'select';
                                        } else { // 同年同月
                                            if (v.day < parseInt(prevArr[1], 0)) return;

                                            v.class = 'select';
                                        }

                                    } else { // 选择的跟上一年不同年，其实就是大于上年

                                        if (v.year  == parseInt(nextArr[0], 0)) {
                                            if (v.month > parseInt(nextArr[1], 0)) return;

                                            if (v.month < parseInt(nextArr[1], 0)) {
                                                v.class = 'select';
                                            } else {
                                                if (v.day > parseInt(nextArr[2], 0)) return;

                                                v.class = 'select';
                                            }
                                        } else {
                                            v.class = 'select';
                                        }

                                    }

                                }
                            }

                        });
                    });
                });
            }
        }
    };
});