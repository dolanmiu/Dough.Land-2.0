/* globals angular */
angular.module('doughlandApp').controller('NavbarCtrl', function ($scope, $location, $window) {
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
        $window.open('cv/download', '_blank');
        //Cv.download();
    }
});