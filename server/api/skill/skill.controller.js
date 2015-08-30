/*jslint nomen: true */
/*globals require, exports */
'use strict';

var _ = require('lodash');
var Skill = require('./skill.model');


function handleError(res, err) {
    return res.send(500, err);
}
// Get list of skills
exports.index = function (req, res) {
    Skill.find(function (err, skills) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, skills);
    });
};

// Get a single skill
exports.show = function (req, res) {
    Skill.findById(req.params.id, function (err, skill) {
        if (err) {
            return handleError(res, err);
        }
        if (!skill) {
            return res.send(404);
        }
        return res.json(skill);
    });
};

// Creates a new skill in the DB.
exports.create = function (req, res) {
    Skill.create(req.body, function (err, skill) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, skill);
    });
};

// Updates an existing skill in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Skill.findById(req.params.id, function (err, skill) {
        if (err) {
            return handleError(res, err);
        }
        if (!skill) {
            return res.send(404);
        }
        var updated = _.merge(skill, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, skill);
        });
    });
};

// Deletes a skill from the DB.
exports.destroy = function (req, res) {
    Skill.findById(req.params.id, function (err, skill) {
        if (err) {
            return handleError(res, err);
        }
        if (!skill) {
            return res.send(404);
        }
        skill.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

exports.createOrUpdate = function (req, res) {
    Skill.findOrCreate({
        name: req.body.name
    }, function (err, skill, created) {
        if (err) {
            return handleError(res, err);
        }
        skill.level = req.body.level;
        skill.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(201, skill);
        });
    });
};