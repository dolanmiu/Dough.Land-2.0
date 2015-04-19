/*globals angular */
angular.module('doughlandApp').config(function ($stateProvider) {
    'use strict';

    $stateProvider.state('update', {
        url: '/update',
        templateUrl: 'app/update/update.html',
        controller: 'UpdateController'
    });
});