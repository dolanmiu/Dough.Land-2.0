/*globals angular, DoughLand, $ */
angular.module('doughlandApp').controller('waterGameController', function ($scope, $window, $rootScope) {
    'use strict';

    var game = new WaterSkillGame.Game();
    game.run('water', function () {
        game.setItemsArray($rootScope.profile.skills.values);
    });
});