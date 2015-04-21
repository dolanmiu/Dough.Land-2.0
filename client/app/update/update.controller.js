/*globals angular, IN */
angular.module('doughlandApp').controller('UpdateController', function ($scope, $http, socket) {
    'use strict';


    $http.get('/api/linkedin').success(function (profiles) {
        $scope.profiles = profiles;
        socket.syncUpdates('linkedin', $scope.profiles);
    });

    $scope.addProfile = function () {
        var profile = document.getElementById('currentProfileBox').value;
        if (!angular.isDefined(profile)) {
            return;
        }
        $http.post('/api/linkedin', profile);
    };

    $scope.deleteProfile = function (profile) {
        $http.delete('/api/linkedin/' + profile._id);
    };

    $scope.setDefaultProfile = function () {
        $http.get('/api/getDefault').success(function (profile) {
            console.log(profile);
        });
    };

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('linkedin');
    });
});