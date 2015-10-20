angular.module('Huijm')

.factory('ShowTime', function(
    $q,
    $http,
    $state,
    $compile,
    $timeout,
    $location,
    $rootScope,
    $cacheFactory,

    cachePool
) {
    var tShowTime = {
        /**
         * 向前多少天
         * @params:
         * time: 1442543369234
         * day: 1
         * type: 返回的格式
         *     1: 2015-1-1
         *     2: 2015-01-01
         */
        getDay: function (params) {
            var self = this;

            var obj = {
                    time: params.time || new Date().getTime(),
                    day: params.day || 0,
                    type: params.type || 1
                },
                tTime = {};

            var source = self._timeObj({
                    time: obj.time,
                    type: obj.type
                }),
                target = self._timeObj({
                    time: obj.time,
                    day:  obj.day,
                    type: obj.type
                });

            return {
                source: source,
                target: target
            };
        },

        /**
         * 根据年月返回 上一个月 和 下一个月的年月, 年月都是js直接转化的年月
         * @params:
         *     year:
         *     month:
         *     type: 1:默认值，月份会加1转化成可视月；2:原始的JS月份，从0开始
         * @response:
         *     prev:
         *     next:
         */
        getDate: function (year, month, type) {
            var result = {
                    prev: {
                        year: '',
                        month: ''
                    },
                    next: {
                        year: '',
                        month: ''
                    }
                };

            if (!type || type == 1) {
                if (month == 0) {
                    result.prev.year  = parseInt(year, 0) - 1;
                    result.prev.month = 12;

                    result.next.year  = parseInt(year, 0);
                    result.next.month = 2;
                } else if (month == 11) {
                    result.prev.year  = parseInt(year, 0);
                    result.prev.month = 11;

                    result.next.year  = parseInt(year, 0) + 1;
                    result.next.month = 1;
                } else {
                    result.prev.year  = parseInt(year, 0);
                    result.prev.month = parseInt(month, 0);

                    result.next.year  = parseInt(year, 0);
                    result.next.month = parseInt(month, 0) + 2;
                }
            } else if (type == 2) {
                if (month == 0) {
                    result.prev.year  = parseInt(year, 0) - 1;
                    result.prev.month = 11;

                    result.next.year  = parseInt(year, 0);
                    result.next.month = parseInt(month, 0) + 1;
                } else if (month == 11) {
                    result.prev.year  = parseInt(year, 0);
                    result.prev.month = parseInt(month, 0) - 1;

                    result.next.year  = parseInt(year, 0) + 1;
                    result.next.month = 0;
                } else {
                    result.prev.year  = parseInt(year, 0);
                    result.prev.month = parseInt(month, 0) - 1;

                    result.next.year  = parseInt(year, 0);
                    result.next.month = parseInt(month, 0) + 1;
                }
            }

            return result;
        },

        /*
         * date: 传入时间，做加0处理返回 2015-1-2 => 2015-01-02
         */
        getFormatDate: function (date) {
            var self = this,
                arr = date.split('-');

            angular.forEach(arr, function (v, k) {
                v = self._addZero(parseInt(v, 0));
            });

            date = self.getDay({ time: new Date(arr.join('/')).getTime(), type: 2 }).source;

            return date;
        },

        /**
         * @params:
         * time: 1442543369234
         * day: 0
         * type: 1
         */
        _timeObj: function (params) {
            var self = this;

            var obj = {
                time: params.time,
                day: params.day || 0,
                type: params.type || 1
            };

            var space = obj.day * 24 * 60 * 60 * 1000 + obj.time,
                time = new Date(space);

            var result = self._timeType({
                time: {
                    year:   time.getFullYear(),
                    month:  time.getMonth() + 1,
                    date:   time.getDate(),
                    hour:   time.getHours(),
                    minute: time.getMinutes(),
                    second: time.getSeconds()
                },
                type: obj.type
            });

            return result;
        },

        /**
         * @params:
         * type: 返回的格式
         *     1: 2015-1-1
         *     2: 2015-01-01
         */
        _timeType: function (params) {
            var self = this;

            var obj = {
                    time: params.time,
                    type: params.type || 1
                },
                result;

            switch (obj.type) {
                case 2:
                    result = obj.time.year +'-'+ self._addZero(obj.time.month) +'-'+ self._addZero(obj.time.date);
                break;

                default:
                    result = obj.time.year +'-'+ obj.time.month +'-'+ obj.time.date;
            }

            return result;
        },

        _addZero: function (num) {
            var result = num;

            if (num < 10) {
                result = 0 + num.toString();
            }

            return result;
        }
    };

    // var a = tShowTime.getDay({
    //     time: 1442543369234,
    //     day: 1,
    //     type: 2
    // });

    // console.log(a);

    return tShowTime;
});
