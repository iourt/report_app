angular.module('Huijm')
.controller('tBaseUser', function (
    $scope,
    $timeout,
    $rootScope,
    $stateParams,
    $ionicSideMenuDelegate,
    
    ShowTime,
    widget,
    toJump
){
    var time = new Date().getTime();
    // $scope.toggleRightSideMenu = function() {
    //     $ionicSideMenuDelegate.toggleRight();
    // };

    $scope.Cate = {
        'activeUser': '活跃用户(人数)',
        'activePer': '活跃度(百分比)'
    };

    // 筛选项
    // $scope.Filter = {
    //     Time: '', //---------时间
    //     TimeType: 'day', //--时间类型
    //     Client: '' //--------客户端类型
    // };

    // $scope.Page = {
    //     Time: new Date().getTime(), //-------服务器当前时间
    //     StartTime: '', //--查询开始时间
    //     EndTime: '' //----查询结束时间
    // };
    // $scope.Page.StartTime = ShowTime.getDay({time: $scope.Page.Time, day: -1}).target;
    // $scope.Page.EndTime   = ShowTime.getDay({time: $scope.Page.Time, day: -1}).source;



    $scope.Page = {};
    $scope.Post = {
        Filter: {
            StartTime: ShowTime.getDay({time: time, day: -1}).target,
            EndTime: ShowTime.getDay({time: time, day: -1}).target,
            Cycle: 'day',
            Client: ''
        }
    };

    // 构造数据结构
    $scope.DataList = {
        List: [], // 列表数据
        X: [],
        Y: []
    };

    customTime();

    // $scope.Page.X = (angular.element(document.querySelector('body')).width()-80)+'px';

    $scope.getData = function () {
        var starttime = ShowTime.getFormatDate($scope.Post.Filter.StartTime),
            endtime = ShowTime.getFormatDate($scope.Post.Filter.EndTime);

        customTime();

        widget.ajaxRequest({
            scope: $scope,
            url: 'report/active',
            data: {
                st: starttime+' 00:00:00',
                et: endtime+' 23:59:59',
                period: $scope.Post.Filter.Cycle,
                os: $scope.Post.Filter.Client
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
            }
        });
    };

    $scope.getData();


    // 监控筛选的改变
    $scope.$watch('Post.Filter', function (newValue, oldValue, scope) {
        if (newValue.Cycle==oldValue.Cycle && newValue.Client==oldValue.Client && newValue.Time==oldValue.Time) return;
        if (newValue.Cycle==oldValue.Cycle && newValue.Client==oldValue.Client && newValue.Time=='custom') return;

        $timeout(function() {
            $scope.getData();
        }, 250);
    }, true);

    // 监控日历的改变
    $scope.$watch('Page.Calendar', function () {
        if (!$scope.Page.Calendar) return;

        $scope.Post.Filter.StartTime = $scope.Page.Calendar.prev;
        $scope.Post.Filter.EndTime   = $scope.Page.Calendar.next || $scope.Page.Calendar.prev;

        $timeout(function() {
            $scope.getData();
        }, 100);
    });


    function customTime() {
        var start = ShowTime.getFormatDate($scope.Post.Filter.StartTime),
            end = ShowTime.getFormatDate($scope.Post.Filter.EndTime);

        $scope.CustomTime = (start == end) ? start : start+'~'+end;
    }
    
    // 去查看报表
    $scope.toRight = function () {
        $rootScope.ViewReport = {
            Title: $scope.CustomTime,
            DataList: $scope.DataList
        };

        toJump({
            direction: 'forward',
            router: 'report.base-user-view'
        });
    };

});
