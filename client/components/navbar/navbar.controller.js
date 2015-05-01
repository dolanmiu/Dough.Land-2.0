/* globals angular */
angular.module('doughlandApp').controller('NavbarCtrl', function ($scope, $location) {
    'use strict';

    $scope.menu = [{
        'title': 'Profile',
        'link': 'profile'
    }, {
        'title': 'Stats',
        'link': 'stats'
    }, {
        'title': 'Resume',
        'link': 'resume'
    }, {
        'title': 'Skills',
        'link': 'skills'
    }, {
        'title': 'Portfolio',
        'link': 'portfolio'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function (route) {
        return route === $location.path();
    };
});