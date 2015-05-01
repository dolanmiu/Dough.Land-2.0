/*globals angular */
angular.module('doughlandApp').controller('ChartController', function ($scope) {
    'use strict';

    $scope.data = [];

    $scope.options = {
        thickness: 60,
        total: 100
    };

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function getRandomNumber(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    function generateRandomColor(mix) {
        var red = getRandomNumber(0, 256),
            green = getRandomNumber(0, 256),
            blue = getRandomNumber(0, 256);

        red = Math.floor((red + 100) / 2);
        green = Math.floor((green + 100) / 2);
        blue = Math.floor((blue + 100) / 2);

        return rgbToHex(red, green, blue);
    }

    $scope.doSomething = function (skill, selected) {
        var i;
        for (i = 0; i < $scope.data.length; i += 1) {
            if ($scope.data[i].id === skill._id) {
                $scope.data.splice(i, 1);
                return;
            }
        }

        $scope.data.push({
            label: skill.skill.name,
            value: 10,
            color: generateRandomColor(),
            id: skill._id
        });
    };
});