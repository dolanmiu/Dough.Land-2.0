'use strict';

var _ = require('lodash');
var googleImages = require('google-images');

// Get list of images
exports.index = function (req, res) {
    request('https://www.kimonolabs.com/api/azqq1x7m?apikey=0dc941efa2f0a2807d63c75b5010706f&kimmodify=1', function (err, response, body) {
        if (err) {
            return handleError(res, err);
        }
        if (response.statusCode === 200) {
            res.setHeader('Content-Type', 'application/json');
            return res.json(200, JSON.parse(body));
        } else {
            return res.send(response.statusCode, body);
        }
    })
};