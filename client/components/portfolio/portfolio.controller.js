/*globals angular */
angular.module('doughlandApp').controller('PortfolioController', function ($scope) {
    'use strict';

    $scope.portfolio = [{
        imageUrl: 'assets/images/office-clippy-thumbnail.png',
        title: 'Office Clippy',
        description: 'Named after the marmite office assistant, Office Clippy is a word-processor made in JavaScript, for JavaScript. It allows one to create Word documents and export them as standalone .docx or as a steam, straight from the power of JavaScript. It has a clean consistent API, and is used by a fair amount of people. Infact, the \'Generate CV\' button you see above is made using Office Clippy! It receives over 400 downloads per month.',
        link: 'https://www.npmjs.com/package/office-clippy'
    }, {
        imageUrl: 'assets/images/mvc6-generator-thumbnail.png',
        title: 'MVC 6 Angular Yeoman Generator',
        description: 'A generator / scaffolding tool I made for Yeoman. Used as a quick way to get oneself started on an MVC 6 vNext project, utilising the best practices. It is used by a fair amount of people and receives over a 100 downloads per month. (It\'s something ok...)',
        link: 'https://www.npmjs.com/package/generator-mvc6-angular'
    }, {
        imageUrl: 'assets/images/beijing-inn-thumbnail.png',
        title: 'Beijing Inn Website',
        description: 'I was tasked to design the Chinese resrautant, Beijing Inn\'s website. This was a simple one page scroll website based on the LAMP stack. It uses Google maps to show the restaurant location, and Lightbox 2.0 to display photos, which are dynamically populated with PHP. Come visit the restaurant if you fancy.',
        link: 'http://www.beijinginn.co.uk'
    }, {
        imageUrl: 'assets/images/urf-soundscape-thumbnail.png',
        title: 'League of Legends URF Soundscape',
        description: 'A competition I entered in which one has to develop something interesting and unique with the API they provide. I decided on creating a nature or city (or anything in between) soundscape which is powered by the events which happen directly in game. Perfect for studying, or relaxing. Sounds made using Logic Pro, and from freesounds.org. Made using AngularJS. It was originally made for the URF event, now it works universally! Horray!',
        link: 'https://lol-soundscape.herokuapp.com/'
    }, {
        imageUrl: 'assets/images/grunt-google-translate-thumbnail.png',
        title: 'Grunt Google Translate',
        description: 'A build task to translate JSON files to other languages using Google\'s Translation API. Pairs very well with angular-translate!',
        link: 'https://www.npmjs.com/package/grunt-google-translate'
    }];
});