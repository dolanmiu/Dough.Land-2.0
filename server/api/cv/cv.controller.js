/*globals require, exports */
'use strict';

var _ = require('lodash');
var Cv = require('./cv.model');
var officegen = require('officegen');
var Linkedin = require('../linkedin/linkedin.model');

function getCvJson(callback, failure) {
    Linkedin.findOne({
        'default': true
    }, {}, function (err, linkedin) {
        if (!linkedin) {
            failure();
            return;
        }
        callback(linkedin);
    });
}

function addHeader(docx, fullName, mobile, linkedIn, email) {
    var pObj = docx.createP();
    pObj.options.align = 'center';
    pObj.addText(fullName);
    pObj.addLineBreak();
    pObj.addText('Mobile: ' + mobile + ' | ' + 'LinkedIn: ' + linkedIn + ' | ' + 'E-mail: ' + email);
}

function addPosition(docx) {
    var pObj = docx.createP();
}

// Get list of cvs
exports.index = function (req, res) {
    var docx = officegen({
        'type': 'docx',
        'creator': 'Dolan Miu'
    });

    getCvJson(function (linkedinJson) {


        //addHeader(docx, linkedinJson.formattedName, linkedinJson.phoneNumbers.values[0].phoneNumber, linkedinJson.publicProfileUrl, linkedinJson.emailAddress);
        //addExperience();        
        //add


        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-disposition': 'attachment; filename=Dolan Miu CV.docx'
        });
        return docx.generate(res);
    }, function () {
        return res.send(500, 'No Default CV Present');
    });
};