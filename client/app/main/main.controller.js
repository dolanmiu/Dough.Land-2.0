/*globals angular */
angular.module('doughlandApp').controller('MainCtrl', function ($scope, $window, GitHub) {
    'use strict';

    function getlastUpdateTime(dateString) {
        var date = new Date(dateString),
            currentDate = new Date(),
            m,
            s,
            milliseconds = currentDate.getTime() - date.getTime();

        return {
            minutes: (milliseconds / 1000 / 60) << 0,
            seconds: Math.floor((milliseconds / 1000) % 60)
        };
    }

    function formatGitHub(raw) {
        var gitHub = {
            contributionsLastYear: {
                amount: raw.results.contributionsLastYear[1].contributionsLastYear.replace(/[^0-9]+/, '')
            },
            longestStreak: {
                amount: raw.results.collection2[1]['longest streak'].replace(/[^0-9]+/, '')
            },
            currentStreak: {
                amount: raw.results.contributionsLastYear[1].currentStreak.replace(/[^0-9]+/, '')
            }
        };

        return gitHub;
    }

    GitHub.get({}, function (gitHub) {
        $scope.gitHub = formatGitHub(gitHub);
        $scope.gitHubTime = getlastUpdateTime(gitHub.thisversionrun);
    }, function (error) {
        GitHub.get({}, function (gitHub) {
            $scope.gitHub = gitHub;
            $scope.gitHubTime = getlastUpdateTime(gitHub.thisversionrun);
        });
    });

    $scope.screenMinusNavHeight = $window.innerHeight - 50;

    $window.addEventListener('resize', function () {
        $scope.screenMinusNavHeight = $window.innerHeight - 50;
    }, false);

});