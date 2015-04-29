/*globals angular */
angular.module('doughlandApp').controller('TextEasterEggController', function ($scope) {
    'use strict';

    var text = ["Java, C#, JS and now AngularJS developer",
                   "Web designer too apparantly",
                   "3D Artist?",
                   "Music producer",
                   "I love good software practice",
                   "Coding is my passion, but then again so are a lot of things",
                   "Add me on league: Deemon",
                   "When will this list stop?",
                   "Am I that bored?",
                   "I keep up to date with the latest stuff",
                   "I like learning new things",
                   "I hate noobs who do bad things, in all aspects of life",
                   "I like EDM music",
                   "Since when did I become a graphics designer?",
                   "I am a huge supporter of AngularJS",
                   "I will probably learn AngularJS 2.0 when it launches",
                   "I have a very keen attention to detail",
                   "I love Bootstrap and Sass",
                   "I LOVE Grunt, Bower and NPM",
                   "I released software on NPM",
                   "Bulding PCs is a nice past-time",
                   "Gaming is a nice past-time",
                   "Secret confession: I don't think Justin Bieber is THAT bad (well not a secret anymore)",
                   "I love game soundtracks. Zelda ♥",
                   "This website was purely made purely because I am too lazy to update my LinkedIn and CV simutaneously",
                   "I watch LinusTechTips",
                   "I like front-end development as much as back-end development",
                   "I used to hate front-end development",
                   "I aspire to work for a games company one day",
                   "I want to be the very best like no one ever was",
                   "Dick in the ass mang",
                   "I love three.js",
                   "MEAN Stack is awesome"
                  ];
    
    $scope.getRandomMessage = function () {
        var randomnumber = Math.floor(Math.random() * (text.length));
        $scope.currentMessage = text[randomnumber];
    };
    
    $scope.currentMessage = text[0];
});