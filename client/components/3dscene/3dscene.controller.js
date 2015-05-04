/*globals angular, DoughLand, $ */
angular.module('doughlandApp').controller('3dSceneController', function ($scope, $window) {
    'use strict';

    DoughLand.Main.run(document.getElementById('main'));
    DoughLand.Main.setSize($('body').innerWidth(), $window.innerHeight);

    function tiltCalculator(screenPosY) {
        var scaledY = screenPosY / 170;
        return 70 * Math.exp(-scaledY) + 0.1;
    }

    $window.addEventListener('scroll', function () {
        var top = this.scrollY,
            convertedTop = tiltCalculator(top);
        DoughLand.Main.tilt(convertedTop);
    }, false);

    $window.addEventListener('resize', function () {
        DoughLand.Main.setSize($('body').innerWidth(), $window.innerHeight);
    }, false);
});