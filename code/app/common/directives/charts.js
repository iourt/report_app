/**
 * 报表控件
 * 调用方式:
 * <view-charts ng-model="*"></view-charts>
 */
angular.module('Huijm')

.directive('viewCharts', function (
    $timeout,
    $window,
    $rootScope,
    widget
) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'common/directives/charts.html',
        // controller: function ($scope, $element, $attrs) {},
        controller: function ($scope, $element, $attrs) {

            $scope.showChart = function (title) {
                var charts = new Highcharts.Chart({
                    chart: {
                        renderTo : 'chart',
                        type: 'spline'
                    },
                    title: {
                        text: $scope.Page.TimeText,
                        align: 'right',
                        margin: 20,
                        style: {
                            fontSize: '12px',
                            color: '#999'
                        }
                    },
                    xAxis: {
                        categories: $scope.DataList.X
                    },

                    yAxis: {
                        title: {
                            text: title || '基础数据统计分析'
                        }
                    },
                    credits:{
                         enabled: false
                    },

                    series: $scope.DataList.Y
                });
            };
        }
    };
});