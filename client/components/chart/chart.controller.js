/*globals angular */
angular.module('doughlandApp').controller('ChartController', function ($scope) {
    'use strict';

    $scope.data = [
        {
            label: "one",
            value: 12.2,
            color: "red"
        },
        {
            label: "two",
            value: 45,
            color: "#00ff00"
        },
        {
            label: "three",
            value: 10,
            color: "rgb(0, 0, 255)"
        }
];
    
    $scope.options = {thickness: 10};
});