/*globals angular, DoughLand, $ */
angular.module('doughlandApp').controller('3dSceneController', function ($scope, $window) {
    'use strict';

    DoughLand.Main.run(document.getElementById('main'));
    DoughLand.Main.setSize($('body').innerWidth(), $window.innerHeight);

    $window.addEventListener("scroll", function (event) {
        var top = this.scrollY,
            left = this.scrollX;
        console.log(top);
        DoughLand.Main.tilt(top);
    }, false);
});