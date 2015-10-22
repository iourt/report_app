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
})


.controller('tBaseUserView', function (
    $scope,
    $timeout,
    $rootScope,
    $stateParams,
    
    ShowTime,
    widget
){
    $scope.Cate = {
        'activeUser': '活跃用户(人数)',
        'activePer': '活跃度(百分比)'
    };

    // 筛选项
    $scope.Filter = {
        Time: '', //---------时间
        TimeType: 'day', //--时间类型
        Client: '' //--------客户端类型
    };

    $scope.Page = {
        Time: new Date().getTime(), //-------服务器当前时间
        StartTime: '', //--查询开始时间
        EndTime: '' //----查询结束时间
    };
    $scope.Page.StartTime = ShowTime.getDay({time: $scope.Page.Time, day: -1}).target;
    $scope.Page.EndTime   = ShowTime.getDay({time: $scope.Page.Time, day: -1}).source;

    // 构造数据结构
    $scope.DataList = {
        List: [], // 列表数据
        X: [],
        Y: []
    };

    // $scope.Page.X = (angular.element(document.querySelector('body')).width()-80)+'px';

    $scope.getData = function () {
        var starttime = ShowTime.getFormatDate($scope.Page.StartTime),
            endtime = ShowTime.getFormatDate($scope.Page.EndTime);

        widget.ajaxRequest({
            scope: $scope,
            url: 'report/active',
            data: {
                st: starttime+' 00:00:00',
                et: endtime+' 23:59:59',
                period: $scope.Filter.TimeType,
                os: $scope.Filter.Client
            },
            success: function (res) {
                $scope.DataList.X = [];
                $scope.DataList.Y = [];
                $scope.DataList.List = res.data.list;

                var arr = {};
                if (res.data.list.length > 0) {
                    angular.forEach(res.data.list, function (v, k) {
                        for (var i in v) {
                            if (!arr[i]) arr[i] = [];

                            if (i == 'activePer') {
                                v[i] = v[i].replace('%', '');
                                arr[i].push(parseFloat(v[i]));
                            } else if (i == 'date') {
                                arr[i].push(v[i]);
                            } else {
                                arr[i].push(parseInt(v[i], 0));
                            }
                        };
                    });

                    $scope.DataList.X = arr['date'].reverse();

                    $scope.DataList.Y[0] = arr['activeUser'].reverse();
                    $scope.DataList.Y[1] = arr['activePer'].reverse();
                }

                $scope.showChart();
            }
        });
    };

    $scope.getData();

    $scope.showChart = function () {
        $('#chart').highcharts({
            chart: {
                // zoomType: 'xy'
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
            xAxis: [ {categories: $scope.DataList.X} ],
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
                    data: $scope.DataList.Y[0],
                    // data: [2],
                    tooltip: { valueSuffix: '人' }
                },
                {
                    name: '活跃度(百分比)',
                    color: '#f30',
                    // type: 'column',
                    type: 'spline',
                    yAxis: 1,
                    data: $scope.DataList.Y[1],
                    tooltip: { valueSuffix: '%' }

                }
            ]
        });
    }
});