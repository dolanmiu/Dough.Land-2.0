/*global exports, require */
var Linkedin = require('../api/linkedin/linkedin.model');
var officeClippy = require('office-clippy');
var docx = officeClippy.docx;
var exporter = officeClippy.exporter;

exports.download = function (req, res, next) {
    'use strict';
    var doc = docx.create();
    var p = docx.createParagraph();
    p.addText(docx.createText('Hello world'));
    doc.addParagraph(p);
    exporter.archive(res, doc, 'Dolan Miu\'s CV');
    //res.send(200, doc);
};