'use strict';

angular.module('doughlandApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
]);

angular.module('doughlandApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
});

angular.module('doughlandApp').run(function ($rootScope, LinkedIn, GitHub) {
    LinkedIn.get({
        Id: 'getDefault'
    }, function (profile) {
        $rootScope.profile = profile;
        console.log(profile);
    });

    GitHub.get({}, function (gitHub) {
        $rootScope.gitHub = gitHub;
    });
});

angular.module('doughlandApp').factory('LinkedIn', function ($resource) {
    'use strict';
    return $resource('/api/linkedin/:Id', {
        Id: '@id'
    });
});

angular.module('doughlandApp').factory('GitHub', function ($resource) {
    'use strict';
    return $resource('https://www.kimonolabs.com/api/azqq1x7m?apikey=0dc941efa2f0a2807d63c75b5010706f');
});