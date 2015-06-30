/* globals angular */
angular.module('doughlandApp').controller('NavbarCtrl', function ($scope, $location, Cv) {
    'use strict';

    $scope.menu = [{
        'title': 'Profile',
        'link': 'profile',
        'icon': 'fa-user'
    }, {
        'title': 'Stats',
        'link': 'stats',
        'icon': 'fa-line-chart'
    }, {
        'title': 'Resume',
        'link': 'resume',
        'icon': 'fa-graduation-cap'
    }, {
        'title': 'Skills',
        'link': 'skills',
        'icon': 'fa-star'
    }, {
        'title': 'Portfolio',
        'link': 'portfolio',
        'icon': 'fa-picture-o'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function (route) {
        return route === $location.path();
    };
    
    $scope.downloadCv = function () {
        Cv.download();
    }
});