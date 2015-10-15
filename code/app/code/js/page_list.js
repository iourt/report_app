Huijm
.controller('tPageList', function (
    $scope,
    $rootScope,
    $stateParams,
    widget
){
    $rootScope.HeaderTab = 'action';
    $rootScope.MenuId    = 3;
    $rootScope.MenuName  = 'page_'+ $stateParams.id;

    $scope.Page = {
        Title: $stateParams.name,
        PageIndex: 1,
        PageSize: 20,
        Id: parseInt($stateParams.id, 0)
    };


    $scope.loadMore = function () {
        widget.ajaxRequest({
            scope: $scope,
            url: 'getPageList',
            data: {
                Id: $scope.Page.Id,
                PageSize: $scope.Page.PageSize,
                PageIndex: $scope.Page.PageIndex
            },
            success: function (res) {
                $scope.DataList = res;

                var total = res.Total;

                $scope.PageTotal = Math.ceil(109/$scope.Page.PageSize);
            },
            error: function (err) {

            }
        });
    };

    $scope.loadMore();

    $scope.setPage = function (e) {
        var $that = angular.element(e.delegationTarget),
            size  = parseInt($that.text());

        if (size != $scope.Page.PageIndex) {
            $scope.Page.PageIndex = size;
            $scope.loadMore();
        }
    };

});
