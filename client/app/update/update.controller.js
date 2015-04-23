/*globals angular */
angular.module('doughlandApp').controller('UpdateController', function ($scope, $http, socket) {
    'use strict';

    $http.get('/api/linkedin').success(function (profiles) {
        $scope.profiles = profiles;
        socket.syncUpdates('linkedin', $scope.profiles);
    });

    function updateProfile(profile) {
        $http.put('/api/linkedin/' + profile._id, profile);
    }

    $scope.addProfile = function () {
        var profile = document.getElementById('currentProfileBox').value;
        if (!angular.isDefined(profile)) {
            return;
        }
        $http.post('/api/linkedin', profile);
    };

    $scope.createCv = function () {
        $http.get('/api/cv').success(function (data) {
            console.log(data);
        });
    };

    $scope.deleteProfile = function (profile) {
        $http.delete('/api/linkedin/' + profile._id);
    };

    $scope.setDefaultProfile = function (profile, isDefault) {
        profile.default = isDefault;
        updateProfile(profile);
        $http.get('/api/linkedin/getDefault').success(function (data) {
            console.log(data);
        });
    };

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('linkedin');
    });
});