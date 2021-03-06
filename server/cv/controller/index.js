/*jslint node: true */
'use strict';
var docx = require('docx');

var Linkedin = require('../../api/linkedin/linkedin.model');
var utility = require('./utility');

function createTitle(titleText) {
    return new docx.Paragraph(titleText).title();
}

function createContactInfoParagraph(phoneNumber, profileUrl, email) {
    var paragraph = new docx.Paragraph().center(),
        contactInfo = new docx.TextRun('Mobile: ' + phoneNumber + ' | LinkedIn: ' + profileUrl + ' | Email: ' + email),
        address = new docx.TextRun('Address: 58 Elm Avenue, Kent ME4 6ER, UK').break();

    paragraph.addText(contactInfo);
    paragraph.addText(address);

    return paragraph;
}

function createSection(sectionText) {
    return new docx.Paragraph(sectionText).heading1().thematicBreak();
}

function createSubSection(text) {
    return new docx.Paragraph(text).heading2();
}

// needs work
function createInstitutionHeader(institutionName, dateText) {
    var paragraph = new docx.Paragraph().maxRightTabStop(),
        institution = new docx.TextRun(institutionName).bold(),
        date = new docx.TextRun(dateText).tab().bold();

    paragraph.addText(institution);
    paragraph.addText(date);

    return paragraph;
}

function createRoleText(roleText) {
    var paragraph = new docx.Paragraph(),
        role = new docx.TextRun(roleText).italic();

    paragraph.addText(role);

    return paragraph;
}

function createBullet(text) {
    return new docx.Paragraph(text).bullet();
}

function createSkillList(skills) {
    var paragraph = new docx.Paragraph(),
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
    paragraph.addText(new docx.TextRun(skillConcat));

    return paragraph;
}

function createInterests(interests) {
    var paragraph = new docx.Paragraph();

    paragraph.addText(new docx.TextRun(interests));
    return paragraph;
}

function createInstitutionPair(item, description, title) {
    var paragraph = new docx.Paragraph(),
        titleText = new docx.TextRun(title).bold(),
        itemText = new docx.TextRun(item + ' - ').tab(),
        descriptionText = new docx.TextRun(description).italic();

    paragraph.leftTabStop(2268);
    if (title !== undefined) {
        paragraph.addText(titleText);
    }
    paragraph.addText(itemText);
    paragraph.addText(descriptionText);

    return paragraph;
}

function createDocument(profile) {
    var doc = new docx.Document({
            creator: 'Dolan Miu',
            description: 'A generated version of my CV from data straight from LinkedIn',
            title: 'Dolan Miu CV'
        }),
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
    Linkedin.findOne({
        'default': true
    }, {}, function (err, linkedIn) {
        if (err) {
            return res.send(500, err);
        }
        if (!linkedIn) {
            return res.send(500, 'No Default CV Present');
        }

        var doc = createDocument(linkedIn),
            exporter = new docx.ExpressPacker(doc, res);

        exporter.pack('Dolan Miu\'s CV');
    });
};