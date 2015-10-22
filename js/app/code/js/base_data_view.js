angular.module('Huijm')

.controller('tBaseDataView', function (
    $scope,
    $timeout,
    $rootScope,
    $stateParams,
    
    ShowTime,
    widget
){
    var time = new Date().getTime();

    $scope.Cate = {
        'id': 1,
        'cate_1': '激活用户',
        'cate_2': '注册用户',
        'cate_3': '认证用户',
        'cate_4': '激活小区'
    };

    $scope.Page = {
        TimeText: '123123'
    };
    $scope.Post = {
        Filter: {
            StartTime: ShowTime.getDay({time: time, day: -6}).target,
            EndTime: ShowTime.getDay({time: time, day: -6}).source,
            Cycle: 'day',
            Client: ''
        }
    };

    // 构造数据结构
    $scope.DataList = {
        Basic: [], // 基础数据
        List: [], // 列表数据
        X: [],
        Y: []
    };

    customTime();


    $scope.View = 'photo';
    // 获取数据
    $scope.getData = function () {
        var starttime = ShowTime.getFormatDate($scope.Post.Filter.StartTime),
            endtime = ShowTime.getFormatDate($scope.Post.Filter.EndTime);

        customTime();

        widget.ajaxRequest({
            scope: $scope,
            url: 'report/overview',
            data: {
                st: starttime+' 00:00:00',
                et: endtime+' 23:59:59',
                period: $scope.Post.Filter.Cycle,
                os: $scope.Post.Filter.Client
                // period: $scope.PostFilter.TimeType,
                // os: $scope.Filter.Client
            },
            success: function (res) {
                $scope.DataList.Basic = [];
                $scope.DataList.List = res.data.list;
                $scope.DataList.X = [];
                $scope.DataList.Y = [];

                for(var i in res.data.overview) {
                    $scope.DataList.Basic.push({
                        name: $scope.Cate[i],
                        num: res.data.overview[i]
                    });
                }

                var arr = {};
                if (res.data.list.length > 0) {
                    angular.forEach(res.data.list, function (v, k) {
                        for (var i in v) {
                            if (!arr[i]) arr[i] = [];
                            arr[i].push(v[i]);
                        };
                    });

                    // angular.forEach(arr['cate_1']);
                    $scope.a1 = widget.getSum(arr['cate_1']),
                    $scope.a2 = widget.getSum(arr['cate_2']),
                    $scope.a3 = widget.getSum(arr['cate_3']),
                    $scope.a4 = widget.getSum(arr['cate_4']);

                    
                    $scope.DataList.X = arr['date'].reverse();
                    $scope.DataList.Y = [
                        {
                            name: '激活用户',
                            data: arr['cate_1'].reverse()
                        },
                        {
                            name: '注册用户',
                            data: arr['cate_2'].reverse()
                        },
                        {
                            name: '认证用户',
                            data: arr['cate_3'].reverse()
                        },
                        {
                            name: '激活小区',
                            data: arr['cate_4'].reverse()
                        }
                    ];
                }

                showChart();
            }
        });
    };

    $scope.getData();
    

    function showChart() {
        $('#chart').highcharts({
            chart: {
                // renderTo : 'chart',
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
                    text: '基础数据统计分析'
                }
            },
            credits:{
                 enabled: false
            },

            series: $scope.DataList.Y
        });
    }


    function customTime() {
        var start = ShowTime.getFormatDate($scope.Post.Filter.StartTime),
            end = ShowTime.getFormatDate($scope.Post.Filter.EndTime);

        $scope.CustomTime = (start == end) ? start : start+'~'+end;
    }
});