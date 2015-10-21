angular.module('Huijm', [
    // 'ui.router',
    // 'ui.router.router',
    'ngCordova',
    'ionic',
    'DelegateEvents'
])
.run( function (
    $rootScope,
    $location,
    $state,

    // $ionicViewSwitcher,
    $ionicPlatform,
    // $ionicConfigProvider,

    // $cordovaNetwork,
    $cordovaKeyboard,
    $cordovaStatusbar,
    $cordovaAppVersion,
    // $cordovaSplashscreen,

    cachePool
) {
    var ua = navigator.userAgent.toLowerCase();
    $rootScope.isHybrid  = window.isHybridCreate ? true : false;
    $rootScope.isApple   = ($rootScope.isHybrid && /iphone|ipad|ipod/.test(ua)) ? true : false;
    $rootScope.isAndroid = ($rootScope.isHybrid && /android/.test(ua)) ? true : false;
    $rootScope.isWeixin  = /micromessenger/.test(ua) ? true : false;

    // alert(JSON.stringify($ionicPlatform));
    // console.log($location.$$host);
    // var host = $location.$$host;
    // $rootScope.apiSocket = 'http://api.huijiame.com/manage/';

    // if (host !== 'report.huijiame.com') {
        $rootScope.apiSocket = 'http://api.huijiame.com/manage/';
    // }

    

    // 获取本地用户信息
    $rootScope.UserInfo = (function () {
        var UserInfo = cachePool.pull('UserInfo');

        if (!UserInfo) UserInfo = {};

        return UserInfo;
    })();

    

    $ionicPlatform.ready(function() {
        
        if (!$rootScope.isHybrid) return;

        // $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusbar.style(1);
        // $cordovaStatusbar.styleColor('black');
        // $cordovaStatusbar.styleHex('#000');
        $cordovaStatusbar.show();

        $cordovaKeyboard.hideAccessoryBar(true);
        $cordovaKeyboard.disableScroll(true);

        // var isOnline = $cordovaNetwork.isOnline();
        // $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        //     widget.msgToast("亲!世界上最遥远的距离就是木有网~");
        // });

        // navigator.splashscreen.hide();
        // $cordovaSplashscreen.hide();

        // if (ENV.isApple) {
        //     $timeout(function(){
        //         $cordovaSplashscreen.hide();
        //     }, 1000);
        // } else {
            // $cordovaSplashscreen.hide();
        // }

        $cordovaAppVersion.getVersionNumber().then(function (version) {
            $rootScope.appVersion = version;
        });
    });
        

    // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // if (!$rootScope.isHybrid) return;
        // if (toState.name == 'report.view') {
        //     window.screen.lockOrientation('landscape');
        // } else {
        //     window.screen.lockOrientation('portrait');
        // }

        
        //     if (!$rootScope.UserInfo || !$rootScope.UserInfo.Auth) {
        //         event.preventDefault();
        //         $ionicViewSwitcher.nextDirection('none');
        //         $state.go('report.login');
        //         return;
        //     } else {
        //         if (toState.name == 'report.login') {
        //             $ionicViewSwitcher.nextDirection('none');
        //             $state.go('report.index', {}, {
        //                 reload: true
        //             });
        //         }
        //     }
    // });
})
.config( function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('report', {
        abstract: true, // 为子状态提供一个 base url，其下所有子状态的 url 都是相对父状态的
        url: '/report'
        // templateUrl: 'code/tp/main.html',
    })

    // 日历
    .state('report.calendar', {
        url: 'calendar',
        templateUrl: 'code/tp/calendar.html',
        controller: 'tCalendar'
    })

    // 后台登录
    .state('report.login', {
        // cache: false,
        url: '/login.htm',
        templateUrl: 'code/tp/login.html',
        controller: 'tLogin'
    })
    
    // 后台登录
    .state('report.view', {
        // cache: false,
        url: '/view.htm',
        templateUrl: 'code/tp/view.html',
        controller: 'tView'
    })

    .state('report.index', {
        // cache: false,
        url: '/index.htm',
        templateUrl: 'code/tp/index.html',
        controller: 'tIndex'
    })
    // 基础数据-数据概况
    .state('report.base-data', {
        url: '/base/data.htm',
        templateUrl: 'code/tp/base_data.html',
        controller: 'tBaseData'
    })
    // 基础数据-活跃用户
    .state('report.base-user', {
        url: '/base/user.htm',
        templateUrl: 'code/tp/base_user.html',
        controller: 'tBaseUser'
    });


    // $ionicConfigProvider.views.swipeBackEnabled(true);
    // $urlRouterProvider.when('', '/index.htm');
    $urlRouterProvider.otherwise('/report/index.htm');

});
