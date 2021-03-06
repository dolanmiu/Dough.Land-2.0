/*jslint node: true, nomen: true */
/*globals Promise */
'use strict';

var _ = require('lodash');
var googleImages = require('google-images');
var request = require('request');

var LinkedIn = require('../linkedin/linkedin.model');

var client = googleImages(process.env.CSE_ID, process.env.GOOGLE_API_KEY);
var imageCache = [];
var loaded = false;

function getImages() {
    return new Promise(function (resolve, reject) {
        LinkedIn.findOne({
            'default': true
        }, {}, function (err, linkedin) {
            var promises = [],
                skills = linkedin.skills.values;

            //console.log(skills);
            //skills = skills.slice(0, 4);

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
                        image.name = skill.skill.name.replace('#', 'sharp');
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
                resolve();
            }, function (err) {
                reject();
            });
        });
    });
}

var getImagesPromise;

function requestImage(imageName) {
    var image = _.find(imageCache, function (image) {
        return image.name === imageName;
    });

    if (!image) {
        return undefined;
    }

    return request(image.url, function (err, response, body) {});
}

exports.getImageFromTerm = function (req, res) {
    if (loaded) {
        var request = requestImage(req.params.term);
        if (request) {
            request.pipe(res);
        } else {
            res.status(404).send();
        }
        return;
    }

    if (getImagesPromise) {
        getImagesPromise.then(function () {
            var request = requestImage(req.params.term);
            if (request) {
                request.pipe(res);
            } else {
                res.status(404).send();
            }
        });
        return;
    }

    getImagesPromise = getImages().then(function () {
        loaded = true;
        var request = requestImage(req.params.term);
        if (request) {
            request.pipe(res);
        } else {
            res.status(404).send();
        }
    });
};