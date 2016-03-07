/*globals angular, DoughLand, $ */
angular.module('doughlandApp').controller('waterGameController', function ($scope, $window) {
    'use strict';

    var game = new WaterSkillGame.Game();
    game.run('water', function () {
        
    });
});