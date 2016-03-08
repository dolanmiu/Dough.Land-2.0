/*jslint node: true, nomen: true */
'use strict';

var _ = require('lodash');
var googleImages = require('google-images');
var client = googleImages(process.env.CSE_ID, process.env.GOOGLE_API_KEY);

// Get list of images
exports.index = function (req, res) {
    client.search('Steve Angello', {
        size: 'medium',
        num: 1
    }).then(function (images) {
        return res.status(200).send(images);
    }, function (err) {
        res.status(500).send(err);
    });
    /*request('https://www.kimonolabs.com/api/azqq1x7m?apikey=0dc941efa2f0a2807d63c75b5010706f&kimmodify=1', function (err, response, body) {

        if (response.statusCode === 200) {
            res.setHeader('Content-Type', 'application/json');
            return res.json(200, JSON.parse(body));
        } else {
            return res.send(response.statusCode, body);
        }
    });*/
};