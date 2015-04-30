/*globals angular, DoughLand, $ */
angular.module('doughlandApp').controller('3dSceneController', function ($scope, $window) {
    'use strict';

    DoughLand.Main.run(document.getElementById('main'));
    DoughLand.Main.setSize($('body').innerWidth(), $window.innerHeight);
    
    function tiltCalculator(screenPosY) {
        var scaledY = screenPosY / 100;
        return 70 * Math.exp(-scaledY) + 0.1;   
    }

    $window.addEventListener("scroll", function (event) {
        var top = this.scrollY,
            left = this.scrollX,
            convertedTop = tiltCalculator(top);
        console.log(convertedTop);
        DoughLand.Main.tilt(convertedTop);
    }, false);

    $window.addEventListener("resize", function (event) {
        DoughLand.Main.setSize($('body').innerWidth(), $window.innerHeight);
    }, false);
});