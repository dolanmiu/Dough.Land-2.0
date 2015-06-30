'use strict';

angular.module('doughlandApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'sticky',
  'n3-pie-chart',
  'duScroll',
  'pageslide-directive'
]);

angular.module('doughlandApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
});

angular.module('doughlandApp').run(function ($rootScope, LinkedIn) {
    LinkedIn.get({
        Id: 'getDefault'
    }, function (profile) {
        $rootScope.profile = profile;
        console.log(profile);
    });
});

angular.module('doughlandApp').factory('LinkedIn', function ($resource) {
    return $resource('/api/linkedin/:Id', {
        Id: '@id'
    });
});

angular.module('doughlandApp').factory('GitHub', function ($resource) {
    return $resource('/api/github/');
});

angular.module('doughlandApp').factory('Cv', function ($resource) {
    return $resource('/cv/:controller', {}, {
        download: {
            method: 'GET',
            params: {
                controller: 'download'
            }
        }
    });
});