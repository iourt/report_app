Huijm
.controller('tIndex', function (
    $scope,
    $rootScope,
    $stateParams,
    ShowTime,
    widget
){
    $rootScope.HeaderTab = 'action';
    $rootScope.MenuId    = 1;
    $rootScope.MenuName  = 'index';

    $scope.Page = {
        TimeType: 'today',
        TimeText: '今天',

        CheckType: 'pv',
        CheckText: '浏览量(PV)',
        
        View: 'photo'
    };

    $scope.Charts = {
        xCate: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    }


    $scope.getData = function () {
        // widget.ajaxRequest({
        //     scope: $scope,
        //     url: 'getIndexData',
        //     data: {
        //         Time: $scope.Page.TimeType
        //     },
        //     success: function (data) {
        //         $scope.DataList.List = data.List;

        //         var type = widget.getCheckType($scope.Page.CheckType);

        //         $scope.DataList.Charts = [
        //             {
        //                 name: $scope.Page.CheckText,
        //                 data: data.List[type]
        //             }
        //         ];

        //         charts();
        //     }
        // });

        charts();
    };


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
                // type: 'datetime'
                categories: $scope.Charts.xCate
            },
            // tooltip: {
            //     xDateFormat: "%A, %b %e, %Y %H:%M",
            //     shared: true
            // },

            // plotOptions: {
            //     series: {
            //         pointStart: Date.UTC(2015, 9, 14, 1),
            //         pointInterval: 60 * 60 * 1000
            //     }
            // },

            yAxis: {
                title: {
                    text: $scope.Page.CheckText
                }
            },
            credits:{
                 enabled: false
            },

            // series: $scope.DataList.Charts
            series: [
                {
                    name: $scope.Page.CheckText,
                    data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                }
            ]
        });
    }



    $scope.getData();
});
