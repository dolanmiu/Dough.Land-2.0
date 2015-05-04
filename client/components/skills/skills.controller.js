/*globals angular */
angular.module('doughlandApp').controller('SkillsController', function ($scope) {
    'use strict';

    $scope.programmingSkills = [{
        name: 'Java',
        score: 90
    }, {
        name: 'C#',
        score: 70
    }, {
        name: 'JavaScript',
        score: 80
    }, {
        name: 'Fundemental Computer Science',
        score: 75
    }];
});