'use strict';
angular.module('Huijm')
/**
 * 文本字数过滤器，当文本字数大于指定的最大字符数（maxCount），则只显示前（maxCount - 2）字符，并在其后显示省略号
 */
.filter('ellipsis', function () {
    return function (item, maxCount) {
        if (item && maxCount > 0 && item.length > maxCount) {
            return item.substring(0, maxCount - 2) + '…';
        }
        return item;
    };
})

/**
 * 定制化的日期过滤器，规则如下：
 * 1.当日期大于一天，返回格式化日期：'yyyy/MM/dd'；
 * 2.当日期小于一天大于一小时，返回：x小时前；
 * 3.当日期小于一小时，返回：刚刚。
 */
.filter('specDate', function ($filter) {
    return function (dateTime) {
        var dateDiff = Date.now() - dateTime,
            result = '刚刚',
            oneHour = 3600 * 1000;
        if (dateDiff > 24 * oneHour) {
            result = $filter('date')(dateTime, 'yyyy/MM/dd');
        } else if (dateDiff > oneHour) {
            result = Math.floor(dateDiff / oneHour) + '小时前';
        }
        return result;
    };
})

/**
 * 百分比
 */
.filter('formatprec', function () {
    return function (num) {
        return num + '%';
    };
})

/**
 * 分页转化
 */
.filter('makeArr', function () {
    return function (input, max, step) {
        step = step || 1;

        for (var i = 1; i <= max; i += step) input.push(i);

        return input;
    };
})

.filter('cate', function () {
    return function (name) {
        alert(name);
        var cate = {
            'cate_1': '激活用户',
            'cate_2': '注册用户',
            'cate_3': '认证用户',
            'cate_4': '激活小区'
        };

        return cate[name];
    }
});
