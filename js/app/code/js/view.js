angular.module('Huijm')

.controller('tBaseDataView', function (
    $scope,
    $timeout,
    $rootScope,
    $stateParams,
    
    ShowTime,
    widget
){
    var Data = $rootScope.ViewReport;

    $scope.showChart = function () {
        $('#chart').highcharts({
            chart: {
                // renderTo : 'chart',
                type: 'spline'
            },
            title: {
                text: Data.Title,
                align: 'right',
                margin: 20,
                style: {
                    fontSize: '12px',
                    color: '#999'
                }
            },
            xAxis: {
                categories: Data.DataList.X
            },

            yAxis: {
                title: {
                    text: '基础数据统计分析'
                }
            },
            credits:{
                 enabled: false
            },

            series: Data.DataList.Y
        });
    };

    $scope.showChart();
})


.controller('tBaseUserView', function (
    $scope,
    $timeout,
    $rootScope,
    $stateParams,
    
    ShowTime,
    widget
){
    var Data = $rootScope.ViewReport;

    $scope.showChart = function () {
        $('#chart').highcharts({
            chart: {
                // zoomType: 'xy'
            },
            title: {
                text: Data.Title,
                align: 'right',
                margin: 20,
                style: {
                    fontSize: '12px',
                    color: '#999'
                }
            },
            xAxis: [ {categories: Data.DataList.X} ],
            yAxis: [
                { // Primary yAxis
                    title: {
                        text: '活跃用户(人数)',
                        style: { color: '#000' }
                    },
                    labels: {
                        format: '{value}',
                        style: { color: '#000' }
                    }
                },
                { // Secondary yAxis
                    title: {
                        text: '活跃度(百分比)',
                        style: { color: '#f30' }
                    },
                    labels: {
                        format: '{value}%',
                        style: { color: '#f30' }
                    },
                    opposite: true
                }
            ],
            tooltip: {
                shared: true
            },
            // legend: {
            //     layout: 'horizontal',
            //     align: 'left',
            //     x: 0,
            //     verticalAlign: 'top',
            //     y: 0,
            //     padding: 0,
            //     floating: true,
            //     backgroundColor: '#fff'
            // },
            credits:{
                 enabled: false
            },
            series: [
                {
                    name: '活跃用户(人数)',
                    color: '#000',
                    type: 'spline',
                    data: Data.DataList.Y[0],
                    // data: [2],
                    tooltip: { valueSuffix: '人' }
                },
                {
                    name: '活跃度(百分比)',
                    color: '#f30',
                    // type: 'column',
                    type: 'spline',
                    yAxis: 1,
                    data: Data.DataList.Y[1],
                    tooltip: { valueSuffix: '%' }

                }
            ]
        });
    };

    $scope.showChart();
});