/*globals angular, DoughLand */
angular.module('doughlandApp').controller('MainCtrl', function ($rootScope, $scope, $http, $window, socket, GitHub) {
    'use strict';
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function (awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function () {
        if ($scope.newThing === '') {
            return;
        }
        $http.post('/api/things', {
            name: $scope.newThing
        });
        $scope.newThing = '';
    };

    $scope.deleteThing = function (thing) {
        $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('thing');
    });

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
    });

    DoughLand.Main.run(document.getElementById('main'));
    DoughLand.Main.setSize($('body').innerWidth(), $window.innerHeight);

    $window.addEventListener("scroll", function (event) {
        var top = this.scrollY,
            left = this.scrollX;
        console.log(top);
        DoughLand.Main.tilt(top);
    }, false);
});