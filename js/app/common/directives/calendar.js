angular.module('Huijm')

.directive('pageCalendar', function (
    $window,
    $rootScope,

    ShowTime,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        templateUrl: 'common/directives/calendar.html',
        // controller: function ($scope, $element, $attrs) {},
        link: function ($scope, $element, $attrs, ngModel) {
            if (!ngModel) return;

            var date = new Date();

            $scope.Init = {
                isLoading: false,
                prevDate: '', //----------------选择的开始日期(临时)
                nextDate: '', //-----------------选择的结束日期(临时)

                pyear:  date.getFullYear(),
                pmonth: date.getMonth(),
                pday:   date.getDate(),

                year:   date.getFullYear(),
                month:  date.getMonth(),
                day:    date.getDate(),

                nyear:  date.getFullYear(),
                nmonth: date.getMonth(),
                nday:   date.getDate()
            };
            $scope.List = [];


            // 闰年
            function isLeap(year) {
                return (year%100==0 ? res=(year%400==0 ? 1 : 0) : res=(year%4==0 ? 1 : 0));
            }


            // 生成日历
            $scope.setCalendar = function (type) {
                if ($scope.Init.isLoading) return;

                $scope.Init.isLoading = true;

                var year,
                    month;

                switch (type) {
                    case 'prev':
                        var tmp = ShowTime.getDate($scope.Init.pyear, $scope.Init.pmonth, 2);
                        year  = tmp.prev.year;
                        month = tmp.prev.month;
                        $scope.Init.pyear  = year;
                        $scope.Init.pmonth = month;
                    break;

                    case 'next':
                        var tmp = ShowTime.getDate($scope.Init.nyear, $scope.Init.nmonth, 2);
                        year  = tmp.next.year;
                        month = tmp.next.month;
                        $scope.Init.nyear  = year;
                        $scope.Init.nmonth = month;
                    break;

                    default:
                        year  = $scope.Init.year;
                        month = $scope.Init.month;
                }

                var tPrevNext = ShowTime.getDate(year, month),
                    firstday = new Date(year, month, 1).getDay(), //------------------------------计算月份的第一天星期几
                    monthDay = [31, 28+isLeap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //--各个月份的总天数
                    line     = Math.ceil((monthDay[month] + firstday) / 7), //--------------------日历显示多少行

                    dateObj  = {
                        Tdate: year+'-'+ShowTime._addZero(parseInt(month, 0)+1),
                        Tday: new Array(line)
                    },
                    last     = (month == 0) ? monthDay[11] : monthDay[month-1],
                    x, //--------单元格自然序列号
                    dateNum; //--计算日期

                for (var i=0; i<line; i++) {
                    dateObj.Tday[i] = [];

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
                            dayData.year  = tPrevNext.prev.year;
                            dayData.month = tPrevNext.prev.month;
                            dayData.day   = last - firstday + k + 1;

                        } else if (dateNum > monthDay[month]) {

                            dayData.class = 'disable';
                            dayData.year  = tPrevNext.next.year;
                            dayData.month = tPrevNext.next.month;
                            dayData.day   = dateNum - monthDay[month];

                        } else {

                            dayData.class = '';
                            dayData.day   = dateNum;

                        }

                        // if (dateNum == $scope.Calendar.iday && year == $scope.Calendar.iyear && month == $scope.Calendar.imonth) {
                        //     dayData.class = 'select';
                        // }

                        // if (dateNum == $scope.Calendar.day) {
                        //     dayData.class = 'select';
                        // }

                        // var tmpDate;

                        // if ($scope.Calendar.nextDate) {
                        //     tmpDate = $scope.Calendar.nextDate.split('-');
                        // } else {
                        //     tmpDate = $scope.Calendar.prevDate.split('-');
                        // }
                        // currentClass({
                        //     year: tmpDate[0],
                        //     month: tmpDate[1],
                        //     day: tmpDate[2]
                        // });

                        dateObj.Tday[i].push(dayData);
                    }
                }
                
                if (type == 'prev') {
                    $scope.List.unshift(dateObj);
                    $scope.Init.isLoading = false;
                    $scope.$broadcast('scroll.refreshComplete');
                } else {
                    $scope.List.push(dateObj);
                    $scope.Init.isLoading = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            };


            // 选择日历
            $scope.chooseCalendar = function (e) {
                var $that = angular.element(e.delegationTarget),
                    flag  = false;

                if ($that.hasClass('disable')) return;

                var year  = parseInt($that.attr('data-year'), 0),
                    month = parseInt($that.attr('data-month'), 0),
                    day   = parseInt($that.attr('data-day'), 0),
                    tmp   = year +'-'+ month +'-'+ day;

                if (!$scope.Init.prevDate) {
                    
                    $scope.Init.prevDate = tmp;

                } else if ($scope.Init.prevDate) {

                    var prev    = $scope.Init.prevDate,
                        arrPrev = $scope.Init.prevDate.split('-');

                    if ($scope.Init.nextDate) {

                        $scope.Init.prevDate = tmp;
                        $scope.Init.nextDate = '';

                    } else {
                        
                        if (parseInt(arrPrev[0], 0) > year) {
                            $scope.Init.nextDate = prev;
                            $scope.Init.prevDate = tmp;
                        } else if (parseInt(arrPrev[0], 0) < year) {
                            $scope.Init.nextDate = tmp;
                        } else {
                            if (parseInt(arrPrev[1], 0) > month) {
                                $scope.Init.nextDate = prev;
                                $scope.Init.prevDate = tmp;
                            } else if (parseInt(arrPrev[1], 0) < month) {
                                $scope.Init.nextDate = tmp;
                            } else {
                                if (parseInt(arrPrev[2], 0) > day) {
                                    $scope.Init.nextDate = prev;
                                    $scope.Init.prevDate = tmp;
                                } else if (parseInt(arrPrev[2], 0) < day) {
                                    $scope.Init.nextDate = tmp;
                                }
                            }
                        }

                    }
                }

                $scope.currentClass({
                    year: year,
                    month: month,
                    day: day
                });

                $scope.setmpCalendar();
            };


            // 改变临时input日期显示
            $scope.setmpCalendar = function () {
                var prev = ShowTime.getFormatDate($scope.Init.prevDate),
                    next = $scope.Init.nextDate ? ShowTime.getFormatDate($scope.Init.nextDate) : '';

                if (prev) {
                    if (next) {
                        $scope.Init.input = prev +' ~ '+ next;
                    } else {
                        $scope.Init.input = prev;
                    }
                } else {
                    $scope.Init.input = '';
                }
            };


            /**
             * 日历选择式样
             * @params:
             *     year:
             *     month:
             *     day:
             */
            $scope.currentClass = function (params) {
                var year  = params.year,
                    month = params.month,
                    day   = params.day;

                var flag = false, // 选择的时间是否为区间
                    prevArr = $scope.Init.prevDate.split('-'),
                    nextArr;

                if ($scope.Init.nextDate) {
                    flag = true;
                    nextArr = $scope.Init.nextDate.split('-');
                }
                angular.forEach($scope.List, function (item, key) {
                    angular.forEach(item.Tday, function (n) {
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
            };


            // 提交数据
            $scope.toSubmit = function () {
                var data = {
                        prev: ShowTime.getFormatDate($scope.Init.prevDate),
                        next: $scope.Init.nextDate ? ShowTime.getFormatDate($scope.Init.nextDate) : ShowTime.getFormatDate($scope.Init.prevDate)
                    };
                
                ngModel.$setViewValue(data);
            };


            $scope.setCalendar();
        }
    };
});
