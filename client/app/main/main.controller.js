/*globals angular */
angular.module('doughlandApp').controller('MainCtrl', function ($scope, $window, GitHub) {
    'use strict';

    function getlastUpdateTime(dateString) {
        var date = new Date(dateString),
            currentDate = new Date(),
            m,
            s,
            milliseconds = currentDate.getTime() - date.getTime();

        date = new Date(milliseconds);
        m = date.getMinutes();
        s = date.getSeconds();


        return {
            minutes: m,
            seconds: s
        };
    }

    GitHub.get({}, function (gitHub) {
        $scope.gitHub = gitHub;
        $scope.gitHubTime = getlastUpdateTime(gitHub.thisversionrun);
    }, function (error) {
        $scope.gitHub = error;
    });

    $scope.screenMinusNavHeight = $window.innerHeight - 50;

    $window.addEventListener('resize', function () {
        $scope.screenMinusNavHeight = $window.innerHeight - 50;
    }, false);

});