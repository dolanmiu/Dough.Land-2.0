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

    var educationHeadingParagraph = docx.createParagraph(sectionText).heading1().thematicBreak();
    return educationHeadingParagraph;
}

function createSubSection(text) {
    'use strict';

    var paragraph = docx.createParagraph(text).heading2();
    return paragraph;
}

function createInstitutionHeader(institutionName, dateText) {
    'use strict';

    var paragraph = docx.createParagraph().addTabStop(docx.createMaxRightTabStop()),
        institution = docx.createText(institutionName).bold(),
        date = docx.createText(dateText).tab().bold();

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

function createSkillList(skills) {
    'use strict';

    var paragraph = docx.createParagraph(),
        i,
        skillConcat = '';

    for (i = 1; i < skills.length; i += 1) {
        skillConcat += skills[i].skill.name;
        if (i === skills.length - 1) {
            skillConcat += '.';
        } else {
            skillConcat += ', ';
        }
    }
    paragraph.addText(docx.createText(skillConcat));

    return paragraph;
}

function createInterests(interests) {
    'use strict';

    var paragraph = docx.createParagraph();

    paragraph.addText(docx.createText(interests));
    return paragraph;
}

function createInstitutionPair(item, description, title) {
    'use strict';

    var paragraph = docx.createParagraph(),
        titleText = docx.createText(title).bold(),
        itemText = docx.createText(item + ' - ').tab(),
        descriptionText = docx.createText(description).italic();

    paragraph.addTabStop(docx.createLeftTabStop(2268));
    if (title !== undefined) {
        paragraph.addText(titleText);
    }
    paragraph.addText(itemText);
    paragraph.addText(descriptionText);

    return paragraph;
}

function createDocument(profile) {
    'use strict';
    var doc = docx.create(),
        i;

    doc.addParagraph(createTitle(profile.formattedName));
    doc.addParagraph(createContactInfoParagraph(profile.phoneNumbers.values[0].phoneNumber, profile.publicProfileUrl, profile.emailAddress));
    doc.addParagraph(createSection('Education'));

    profile.educations.values.forEach(function (education) {
        doc.addParagraph(createInstitutionHeader(education.schoolName, education.startDate.year + ' - ' + education.endDate.year));
        doc.addParagraph(createRoleText(education.fieldOfStudy + ' - ' + education.degree));

        var bulletPoints = utility.splitParagraphTextIntoBullets(education.notes);
        bulletPoints.forEach(function (bulletPoint) {
            doc.addParagraph(createBullet(bulletPoint));
        });
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

    doc.addParagraph(createSection('Skills, Achievements and Interests'));

    doc.addParagraph(createSubSection('Skills'));

    doc.addParagraph(createSkillList(profile.skills.values));


    for (i = 0; i < profile.honorsAwards.values.length; i += 1) {
        if (i === 0) {
            doc.addParagraph(createInstitutionPair(profile.honorsAwards.values[i].issuer, profile.honorsAwards.values[i].name, 'Achievements'));
        } else {
            doc.addParagraph(createInstitutionPair(profile.honorsAwards.values[i].issuer, profile.honorsAwards.values[i].name));
        }
    }

    for (i = 0; i < profile.volunteer.volunteerExperiences.values.length; i += 1) {
        if (i === 0) {
            doc.addParagraph(createInstitutionPair(profile.volunteer.volunteerExperiences.values[i].organization.name, profile.volunteer.volunteerExperiences.values[i].role, 'Volunteering'));
        } else {
            doc.addParagraph(createInstitutionPair(profile.volunteer.volunteerExperiences.values[i].organization.name, profile.volunteer.volunteerExperiences.values[i].role));
        }
    }

    doc.addParagraph(createSubSection('Interests'));

    doc.addParagraph(createInterests(profile.interests));

    doc.addParagraph(createSection('References'));

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

        exporter.express(res, doc, 'Dolan Miu\'s CV');
    });
};