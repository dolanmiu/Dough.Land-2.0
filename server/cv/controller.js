/*global exports, require */
var Linkedin = require('../api/linkedin/linkedin.model');
var officeClippy = require('office-clippy');
var docx = officeClippy.docx;
var exporter = officeClippy.exporter;

exports.download = function (req, res, next) {
    'use strict';
    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    var doc = docx.create();
    exporter.archive(res);
    //res.send(200, doc);
};