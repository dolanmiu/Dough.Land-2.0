'use strict';

var _ = require('lodash');
var Cv = require('./cv.model');
var officegen = require('officegen');

// Get list of cvs
exports.index = function (req, res) {
    var docx = officegen({
        'type': 'docx', // or 'xlsx', etc 
        'onend': function (written) {
            console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n');
        },
        'onerr': function (err) {
            console.log(err);
        }
    });
    //console.log(pptx);
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    docx.generate(res);
    return;
};

function handleError(res, err) {
    return res.send(500, err);
}