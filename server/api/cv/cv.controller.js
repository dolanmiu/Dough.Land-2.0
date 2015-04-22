'use strict';

var _ = require('lodash');
var Cv = require('./cv.model');
var officegen = require('officegen');
var Linkedin = require('../linkedin/linkedin.model');

// Get list of cvs
exports.index = function (req, res) {
    var docx = officegen({
        'type': 'docx',
        'creator': 'Dolan Miu'
    });

    getCvJson(function (linkedinJson) {

        var pObj = docx.createP();
        pObj.addText(linkedinJson.firstName);









        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-disposition': 'attachment; filename=Dolan Miu CV.docx'
        });
        return docx.generate(res);
    }, function () {
        return res.send(404);
    });
};

function getCvJson(callback, failure) {
    Linkedin.findOne({
        'default': true
    }, {}, function (err, linkedin) {
        if (!linkedin) {
            failure();
        }
        callback(linkedin);
    });
}

function addHeader() {

}

function handleError(res, err) {
    return res.send(500, err);
}