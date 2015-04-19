/*globals angular, IN */
angular.module('doughlandApp').controller('UpdateController', function ($scope, $http) {
    'use strict';

    var profile;
    
    function onLinkedInAuth() {
        IN.API.Raw().url('/people/~:(id,first-name,skills,educations,languages,date-of-birth,certifications,last-modified-timestamp,interests,positions,proposal-comments,associations,publications,patents,courses,volunteer,num-recommenders,recommendations-received,honors-awards)?format=json').result(function displayProfiles(newProfile) {
            profile = newProfile;
            console.log(newProfile);
        });
    }

    $scope.onload = function () {
        console.log("logging in");
        IN.Event.on(IN, "auth", onLinkedInAuth);
    };

    $scope.updateProfile = function () {
        console.log("Adding:");
        console.log(profile);
        $http.post('/api/linkedin', profile);
    };

    $http.get('/api/linkedin').success(function (profile) {
        $scope.currentProfile = profile;
    });
});