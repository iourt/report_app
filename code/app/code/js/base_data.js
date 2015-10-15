Huijm
.controller('tBaseData', function (
    $scope,
    $rootScope,
    $stateParams,
    ShowTime,
    widget
){
    $rootScope.HeaderTab = 'base';
    $rootScope.MenuId    = 'base_data';
    $rootScope.HideSub   = true;


    $scope.Cate = {
        'cate_1': '激活用户',
        'cate_2': '注册用户',
        'cate_3': '认证用户',
        'cate_4': '激活小区'
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
    $scope.Page.StartTime = ShowTime.getDay({time: $scope.Page.Time, day: -6}).target;
    $scope.Page.EndTime   = ShowTime.getDay({time: $scope.Page.Time, day: -6}).source;

    // 构造数据结构
    $scope.DataList = {
        Basic: [], // 基础数据
        List: [], // 列表数据
        X: [],
        Y: []
    };

    // $scope.Page.X = (angular.element(document.querySelector('body')).width()-80)+'px';

    // 获取数据
    $scope.getData = function () {
        var starttime = ShowTime.getFormatDate($scope.Page.StartTime),
            endtime = ShowTime.getFormatDate($scope.Page.EndTime);

        widget.ajaxRequest({
            scope: $scope,
            url: 'report/overview',
            data: {
                st: starttime+' 00:00:00',
                et: endtime+' 23:59:59',
                period: $scope.Filter.TimeType,
                os: $scope.Filter.Client
            },
            success: function (res) {
                $scope.DataList.Basic = [];
                $scope.DataList.X = [];
                $scope.DataList.Y = [];
                $scope.DataList.List = res.data.list;

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

                $scope.showChart();
            }
        });
    };

    $scope.getData();
});
