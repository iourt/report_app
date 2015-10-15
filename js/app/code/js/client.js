Huijm
.controller('tClient', function (
    $scope,
    $rootScope,
    $stateParams,
    widget
){
    $rootScope.HeaderTab = 'action';
    $rootScope.MenuId    = 2;
    $rootScope.MenuName  = 'client_'+ $stateParams.type;

    $scope.Page = {
        TimeType: $stateParams.time ? $stateParams.time: 'today',
        TimeText: widget.getTimeText($stateParams.time)
    };

    var colors = Highcharts.getOptions().colors,
        categories = ['Android', 'IOS'],
        data = [
            {
                y: 55.11,
                color: colors[5],
                drilldown: {
                    name: 'Android versions',
                    categories: ['Android 3.0', 'Android 4.0', 'Android 8.0', 'Android 9.0'],
                    data: [10.85, 7.35, 33.06, 2.81],
                    color: colors[0]
                }
            }, {
                y: 21.63,
                color: colors[6],
                drilldown: {
                    name: 'IOS versions',
                    categories: ['IOS 2.0', 'IOS 3.0', 'IOS 3.5', 'IOS 3.6', 'IOS 4.0'],
                    data: [0.20, 0.83, 1.58, 13.12, 5.43],
                    color: colors[1]
                }
            }
        ],
        browserData = [],
        versionsData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;


    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

        // add browser data
        browserData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            versionsData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }


    function charts() {
        var charts = new Highcharts.Chart({
            chart: {
                renderTo : 'chart',
                type: 'pie'
            },
            title: {
                text: '客户端分布图',
                align: 'left',
                margin: 20,
                style: {
                    fontSize: '12px',
                    color: '#999'
                }
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                }
            },
            tooltip: {
                valueSuffix: '%'
            },
            series: [{
                name: 'Browsers',
                data: browserData,
                size: '60%',
                dataLabels: {
                    formatter: function () {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: 'white',
                    distance: -30
                }
            }, {
                name: 'Versions',
                data: versionsData,
                size: '80%',
                innerSize: '60%',
                dataLabels: {
                    formatter: function () {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%'  : null;
                    }
                }
            }],
            credits:{
                 enabled: false
            }
        });
    }

    charts();
});
