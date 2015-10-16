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

    $cordovaNetwork,
    $cordovaKeyboard,
    $cordovaStatusbar,
    $cordovaAppVersion,
    // $cordovaSplashscreen,

    cachePool
) {

    // alert(JSON.stringify($ionicPlatform));
    // console.log($location.$$host);
    // var host = $location.$$host;
    // $rootScope.apiSocket = 'http://api.huijiame.com/manage/';

    // if (host !== 'report.huijiame.com') {
        $rootScope.apiSocket = 'http://testapi.huijiame.com/manage/';
    // }

    // 获取本地用户信息
    $rootScope.UserInfo = (function () {
        var UserInfo = cachePool.pull('UserInfo');

        if (!UserInfo) {
            UserInfo = { UserId: 0 };
        }

        return UserInfo;
    })();

    $ionicPlatform.ready(function() {
        // $cordovaStatusbar.overlaysWebView(true);
        $cordovaStatusbar.style(1);
        // $cordovaStatusbar.styleColor('black');
        // $cordovaStatusbar.styleHex('#000');
        $cordovaStatusbar.show();

        $cordovaKeyboard.hideAccessoryBar(true);
        $cordovaKeyboard.disableScroll(true);

        var isOnline = $cordovaNetwork.isOnline();
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            widget.msgToast("亲!世界上最遥远的距离就是木有网~");
        });

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
})
.config( function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('report', {
        abstract: true, // 为子状态提供一个 base url，其下所有子状态的 url 都是相对父状态的
        url: '/mg'
        // templateUrl: 'code/tp/main.html',
    })

    // 后台登录
    .state('report.login', {
        // cache: false,
        url: '/login.htm',
        templateUrl: 'code/tp/login.html',
        controller: 'tLogin'
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



    // $urlRouterProvider.when('', '/index.htm');
    $urlRouterProvider.otherwise('/mg/index.htm');

});
