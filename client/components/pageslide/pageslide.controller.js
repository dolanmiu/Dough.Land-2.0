/*globals angular */
angular.module('doughlandApp').controller('PageSlideController', function ($scope) {
    'use strict';

    $scope.checked = false;

    $scope.toggle = function () {
        $scope.checked = !$scope.checked;
    };
});