/*global exports, require */
var Linkedin = require('../api/linkedin/linkedin.model');
var officeClippy = require('office-clippy');
var docx = officeClippy.docx;
var exporter = officeClippy.exporter;

function createContactInfoParagraph() {
    'use strict';

    var contactInfoParagraph = docx.createParagraph().center(),
        contactInfo = docx.createText('Mobile: +44 (0) 7595672701 | LinkedIn: uk.linkedin.com/in/dolan1 | Email: dolan_miu@hotmail.com'),
        address = docx.createText('Address: 58 Elm Avenue, Kent ME4 6ER, UK').break();

    contactInfoParagraph.addText(contactInfo);
    contactInfoParagraph.addText(address);

    return contactInfoParagraph;
}

function createHeading() {
    'use strict';

    var educationHeadingParagraph = docx.createParagraph("Education").heading2().thematicBreak();
    return educationHeadingParagraph;
}

function createInstitution() {
    'use strict';

    var paragraph = docx.createParagraph().enableRightText(),
        institution = docx.createText("University College London"),
        date = docx.createText("Date").rightText();

    paragraph.addText(institution);
    paragraph.addText(date);

    return paragraph;
}

function createBullet() {
    'use strict';

    var paragraph = docx.createParagraph("Stuff happens here").bullet();

    return paragraph;
}

exports.download = function (req, res, next) {
    'use strict';

    var doc = docx.create();

    var dolanMiuTitle = docx.createParagraph().heading1();
    dolanMiuTitle.addText(docx.createText('Dolan Miu'));
    doc.addParagraph(dolanMiuTitle);
    doc.addParagraph(createContactInfoParagraph());
    doc.addParagraph(createHeading());
    doc.addParagraph(createInstitution());
    doc.addParagraph(createBullet());
    doc.addParagraph(createBullet());

    exporter.archive(res, doc, 'Dolan Miu\'s CV');
    //res.send(200, doc);
};