/*globals angular */
angular.module('doughlandApp').controller('ChartController', function ($scope) {
    'use strict';

    $scope.data = [
        {
            label: "CPU",
            value: 75,
            suffix: "%",
            color: "steelblue"
        },
        {
            label: "CPwU",
            value: 25,
            suffix: "%",
            color: "steelblue"
        }
];

    $scope.options = {
        thickness: 5,
        mode: "gauge",
        total: 100
    };

    $scope.doSomething = function (skill, selected) {
        console.log(selected);
    }
});