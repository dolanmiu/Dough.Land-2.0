'use strict';

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
            }
        }]
    },
    firstName: String,
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
            skill: String
        }]
    },
    volenteer: {
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
        volenteerExperiences: {
            values: [{
                id: Number,
                organization: {
                    name: String
                },
                role: String
            }]
        }
    },
    info: String,
    active: Boolean
});

module.exports = mongoose.model('Linkedin', LinkedinSchema);