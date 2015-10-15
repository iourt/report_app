Huijm
.controller('tPageDetail', function (
    $scope,
    $rootScope,
    $stateParams,
    widget,
    ShowTime
){
    $rootScope.HeaderTab = 'action';
    $rootScope.MenuId    = 3;
    $rootScope.MenuName  = 'page_'+ $stateParams.mid;

    $scope.Page = {
        Time: new Date().getTime(), //-------服务器当前时间
        StartTime: '', //--查询开始时间
        EndTime: '' //----查询结束时间
    };
    $scope.Page.StartTime = ShowTime.getDay({time: $scope.Page.Time}).source;
    $scope.Page.EndTime   = ShowTime.getDay({time: $scope.Page.Time}).target;

    // 构造数据结构
    $scope.DataList = {
        List: {},
        Charts: []
    };

    // 进入页面获取数据
    // getData(); 


    $scope.getData = function () {
        if ($scope.Page.CheckType == 'btn') {
            widget.ajaxRequest({
                scope: $scope,
                url: 'getDetailButton',
                data: {
                    Time: $scope.Page.TimeType
                },
                success: function (data) {
                    $scope.DataList.Charts = [];

                    angular.forEach(data.List, function (v, k) {
                        $scope.DataList.Charts.push({
                            name: v.Id,
                            data: v.Data
                        });
                    });

                    charts();
                    // $scope.showCharts();
                }
            });
        }

        if ($scope.Page.CheckType != 'btn') {
            widget.ajaxRequest({
                scope: $scope,
                url: 'getDetailData',
                data: {
                    Time: {
                        Start: $scope.Page.StartTime,
                        End: $scope.Page.EndTime
                    }
                },
                success: function (data) {
                    console.log(data);
                    $scope.DataList.List = data.List;

                    var type = widget.getCheckType($scope.Page.CheckType);
                    $scope.DataList.Charts = [
                        {
                            name: $scope.Page.CheckText,
                            data: data.List[type]
                        }
                    ];

                    charts();
                    // $scope.showCharts();
                }
            });
        }
    }


    function charts() {
        if ($scope.Page.View != 'photo') return;

        var charts = new Highcharts.Chart({
            chart: {
                renderTo : 'chart',
                type: 'line'
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
                // categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
                type: 'datetime'
            },
            tooltip: {
                xDateFormat: "%A, %b %e, %Y %H:%M",
                shared: true
            },

            plotOptions: {
                series: {
                    pointStart: Date.UTC(2015, 9, 14, 1),
                    pointInterval: 60 * 60 * 1000
                }
            },

            yAxis: {
                title: {
                    text: $scope.Page.CheckText
                }
            },
            credits:{
                 enabled: false
            },

            series: $scope.DataList.Charts
        });
    }


    $scope.getData();
});
