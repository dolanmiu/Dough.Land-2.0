/* globals angular */
angular.module('doughlandApp').controller('NavbarCtrl', function ($scope, $location) {
    'use strict';

    $scope.menu = [{
        'title': 'Profile',
        'link': '/'
    }, {
        'title': 'Stats',
        'link': ''
    }, {
        'title': 'Resume',
        'link': ''
    }, {
        'title': 'Skills',
        'link': ''
    }, {
        'title': 'Portfolio',
        'link': ''
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function (route) {
        return route === $location.path();
    };
});