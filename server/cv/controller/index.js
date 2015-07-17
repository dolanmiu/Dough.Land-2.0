/*global exports, require */
var officeClippy = require('office-clippy');
var docx = officeClippy.docx;
var exporter = officeClippy.exporter;

var Linkedin = require('../../api/linkedin/linkedin.model');
var utility = require('./utility');

function createTitle(titleText) {
    'use strict';

    var title = docx.createParagraph().title();
    title.addText(docx.createText(titleText));

    return title;
}

function createContactInfoParagraph(phoneNumber, profileUrl, email) {
    'use strict';

    var contactInfoParagraph = docx.createParagraph().center(),
        contactInfo = docx.createText('Mobile: ' + phoneNumber + ' | LinkedIn: ' + profileUrl + ' | Email: ' + email),
        address = docx.createText('Address: 58 Elm Avenue, Kent ME4 6ER, UK').break();

    contactInfoParagraph.addText(contactInfo);
    contactInfoParagraph.addText(address);

    return contactInfoParagraph;
}

function createSection(sectionText) {
    'use strict';

    var educationHeadingParagraph = docx.createParagraph(sectionText).heading2().thematicBreak();
    return educationHeadingParagraph;
}

function createInstitutionHeader(institutionName, dateText) {
    'use strict';

    var paragraph = docx.createParagraph().enableRightText(),
        institution = docx.createText(institutionName).bold(),
        date = docx.createText(dateText).rightText();

    paragraph.addText(institution);
    paragraph.addText(date);

    return paragraph;
}

function createRoleText(roleText) {
    'use strict';

    var paragraph = docx.createParagraph(),
        role = docx.createText(roleText).italic();

    paragraph.addText(role);

    return paragraph;
}

function createBullet(text) {
    'use strict';

    var paragraph = docx.createParagraph(text).bullet();

    return paragraph;
}

function createDocument(profile) {
    'use strict';
    var doc = docx.create();

    doc.addParagraph(createTitle(profile.formattedName));
    doc.addParagraph(createContactInfoParagraph(profile.phoneNumbers.values[0].phoneNumber, profile.publicProfileUrl, profile.emailAddress));
    doc.addParagraph(createSection('Education'));

    profile.educations.values.forEach(function (education) {
        doc.addParagraph(createInstitutionHeader(education.schoolName, education.startDate.year + ' - ' + education.endDate.year));
        doc.addParagraph(createRoleText(education.fieldOfStudy + ' - ' + education.degree));
        doc.addParagraph(createBullet());
        doc.addParagraph(createBullet());
    });

    doc.addParagraph(createSection('Experience'));

    profile.positions.values.forEach(function (position) {
        doc.addParagraph(createInstitutionHeader(position.company.name, utility.createPositionDateText(position.startDate, position.endDate, JSON.parse(position.isCurrent))));
        doc.addParagraph(createRoleText(position.title));

        var bulletPoints = utility.splitParagraphTextIntoBullets(position.summary);

        bulletPoints.forEach(function (bulletPoint) {
            doc.addParagraph(createBullet(bulletPoint));
        });
    });

    doc.addParagraph(createSection('Skills'));

    return doc;
}

exports.download = function (req, res, next) {
    'use strict';

    Linkedin.findOne({
        'default': true
    }, {}, function (err, linkedIn) {
        if (err) {
            return res.send(500, err);
        }
        if (!linkedIn) {
            return res.send(500, 'No Default CV Present');
        }

        var doc = createDocument(linkedIn);
        exporter.archive(res, doc, 'Dolan Miu\'s CV');
    });
};