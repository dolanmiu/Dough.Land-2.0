angular.module('doughlandApp').directive('navbar', function () {
  return {
    restrict: 'E',
    templateUrl: 'components/navbar/navbar.html',
    controller: 'NavbarController'
  }
});
