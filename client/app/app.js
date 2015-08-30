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
  'pageslide-directive',
  'akoenig.deckgrid'
]);

angular.module('doughlandApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
});

angular.module('doughlandApp').run(function ($rootScope, LinkedIn) {
    LinkedIn.getDefault(function (profile) {
        $rootScope.profile = profile;
    });
});

angular.module('doughlandApp').factory('LinkedIn', function ($resource) {
    return $resource('/api/linkedin/:id/:controller', {
        id: '@id'
    }, {
        getDefault: {
            method: 'GET',
            params: {
                controller: 'getDefault'
            }
        }
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

angular.module('doughlandApp').factory('Skill', function ($resource) {
    return $resource('/api/skills/:id/:controller', {
        id: '@_id'
    }, {
        createOrUpdate: {
            method: 'POST',
            params: {
                controller: 'createOrUpdate'
            }
        }
    });
});