/*globals require, module */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LinkedinSchema = new Schema({
    certifications: {
        values: [{
            id: Number,
            name: String
        }]
    },
    courses: {
        values: [{
            id: Number,
            name: String
        }]
    },
    dateOfBirth: {
        day: Number,
        month: Number,
        year: Number
    },
    educations: {
        values: [{
            activities: String,
            degree: String,
            endDate: {
                year: Number
            },
            fieldOfStudy: String,
            id: Number,
            schoolName: String,
            startDate: {
                year: Number
            },
            notes: String
        }]
    },
    firstName: String,
    lastName: String,
    formattedName: String,
    summary: String,
    pictureUrls: {
        values: []
    },
    publicProfileUrl: String,
    industry: String,
    emailAddress: String,
    phoneNumbers: {
        values: [{
            phoneNumber: String,
            phoneType: String
        }]
    },
    honorsAwards: {
        values: [{
            id: Number,
            issuer: String,
            name: String
        }]
    },
    id: String,
    interests: String,
    languages: {
        values: [{
            id: Number,
            language: {
                name: String
            }
        }]
    },
    lastModifiedTimestamp: Number,
    numRecommenders: Number,
    positions: {
        values: [{
            company: {
                id: Number,
                name: String
            },
            id: Number,
            isCurrent: Boolean,
            startDate: {
                month: Number,
                year: Number
            },
            endDate: {
                month: Number,
                year: Number
            },
            summary: String,
            title: String
        }]
    },
    proposalComments: String,
    recommendationsReceived: {
        values: [{
            id: Number,
            recommendationText: String,
            recommendationType: {
                code: String
            },
            recommender: {
                firstName: String,
                id: String,
                lastName: String
            }
        }]
    },
    skills: {
        values: [{
            id: Number,
            skill: {
                name: String
            }
        }]
    },
    volunteer: {
        causes: {
            values: [{
                name: String
            }]
        },
        opportunities: {
            boardMember: Boolean,
            proBono: Boolean
        },
        supportedOrganizations: {
            values: [{
                id: Number,
                name: String
            }]
        },
        volunteerExperiences: {
            values: [{
                id: Number,
                organization: {
                    name: String
                },
                role: String
            }]
        }
    },
    default: Boolean,
    getDate: Date
});

module.exports = mongoose.model('Linkedin', LinkedinSchema);