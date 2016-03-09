/*jslint node: true, nomen: true */
/*globals Promise */
'use strict';

var _ = require('lodash');
var googleImages = require('google-images');
var request = require('request');

var LinkedIn = require('../linkedin/linkedin.model');

var client = googleImages(process.env.CSE_ID, process.env.GOOGLE_API_KEY);
var imageCache = [];

// Get list of images
exports.index = function (req, res) {
    LinkedIn.findOne({
        'default': true
    }, {}, function (err, linkedin) {
        var promises = [],
            skills = linkedin.skills.values;
        
        console.log(skills);

        skills.forEach(function (skill) {
            var promise = new Promise(function (resolve, reject) {
                var image = _.find(imageCache, function (image) {
                    return image.name === skill.skill.name;
                });

                console.log(image);

                if (image) {
                    console.log('image exists already');
                    return resolve();
                }

                client.search(skill.skill.name + ' logo transparent', {
                    size: 'medium'
                }).then(function (images) {
                    console.log('found image: ' + skill.skill.name);
                    var image = images[0];
                    image.name = skill.skill.name;
                    imageCache.push(image);
                    resolve();
                }, function (err) {
                    reject();
                });
            });

            promises.push(promise);
        });

        console.log(promises);

        Promise.all(promises).then(function (result) {
            res.status(200).send(imageCache);
        });
    });
    /*
    request(images[0].url, function (err, response, body) {

    });
    request('https://www.kimonolabs.com/api/azqq1x7m?apikey=0dc941efa2f0a2807d63c75b5010706f&kimmodify=1', function (err, response, body) {

        if (response.statusCode === 200) {
            res.setHeader('Content-Type', 'application/json');
            return res.json(200, JSON.parse(body));
        } else {
            return res.send(response.statusCode, body);
        }
    });*/
};