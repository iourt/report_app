angular.module('Huijm')
.controller('tBaseVillage', function (
    $scope,
    $timeout,
    $rootScope,
    $stateParams,
    $ionicScrollDelegate,
    $ionicSideMenuDelegate,
    
    ShowTime,
    widget,
    toJump
){
    var time = new Date().getTime();

    $scope.Cate = {
        'id': 1,
        'cate_1': '激活用户',
        'cate_2': '注册用户',
        'cate_3': '认证用户',
        'cate_4': '激活小区'
    };

    $scope.Page = {};
    $scope.Post = {
        Filter: {
            StartTime: ShowTime.getDay({time: time, day: -6}).target,
            EndTime: ShowTime.getDay({time: time, day: -1}).target,
            Cycle: 'day',
            Client: ''
        }
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
    // $scope.Page.StartTime = ShowTime.getDay({time: $scope.Page.Time, day: -6}).target;
    // $scope.Page.EndTime   = ShowTime.getDay({time: $scope.Page.Time, day: -6}).source;

    // 构造数据结构
    $scope.DataList = {
        Basic: [], // 基础数据
        List: [], // 列表数据
        X: [],
        Y: []
    };

    customTime();

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

                    console.log(arr);

                    // angular.forEach(arr['cate_1']);
                    $scope.a1 = widget.getSum(arr['cate_1']),
                    $scope.a2 = widget.getSum(arr['cate_2']),
                    $scope.a3 = widget.getSum(arr['cate_3']),
                    $scope.a4 = widget.getSum(arr['cate_4']);

                    
                    $scope.DataList.X = arr['date'].reverse();
                    $scope.DataList.Y = [
                        // {
                        //     name: '激活用户',
                        //     data: arr['cate_1'].reverse()
                        // },
                        // {
                        //     name: '注册用户',
                        //     data: arr['cate_2'].reverse()
                        // },
                        // {
                        //     name: '认证用户',
                        //     data: arr['cate_3'].reverse()
                        // },
                        {
                            name: '激活小区',
                            data: arr['cate_4'].reverse()
                        }
                    ];
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
            router: 'report.base-data-view'
        });
    };


    // $timeout(function(){
    //     //return false; // <--- comment this to "fix" the problem
    //     var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();

    //     var container = sv.__container;

    //     var originaltouchStart = sv.touchStart;
    //     var originalmouseDown = sv.mouseDown;
    //     var originaltouchMove = sv.touchMove;
    //     var originalmouseMove = sv.mouseMove;

    //     container.removeEventListener('touchstart', sv.touchStart);
    //     container.removeEventListener('mousedown', sv.mouseDown);
    //     document.removeEventListener('touchmove', sv.touchMove);
    //     document.removeEventListener('mousemove', sv.mousemove);


    //     sv.touchStart = function(e) {
    //       e.preventDefault = function(){}
    //       originaltouchStart.apply(sv, [e]);
    //     }

    //     sv.touchMove = function(e) {
    //       e.preventDefault = function(){}
    //       originaltouchMove.apply(sv, [e]);
    //     }

    //     sv.mouseDown = function(e) {
    //       e.preventDefault = function(){}
    //       originalmouseDown.apply(sv, [e]);
    //     }

    //     sv.mouseMove = function(e) {
    //       e.preventDefault = function(){}
    //       originalmouseMove.apply(sv, [e]);
    //     }

    //     container.addEventListener("touchstart", sv.touchStart, false);
    //     container.addEventListener("mousedown", sv.mouseDown, false);
    //     document.addEventListener("touchmove", sv.touchMove, false);
    //     document.addEventListener("mousemove", sv.mouseMove, false);
    // });
});