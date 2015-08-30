'use strict';

var _ = require('lodash');
var Linkedin = require('./linkedin.model');
var Skill = require('../skill/skill.model');

// Get list of linkedins
exports.index = function (req, res) {
    Linkedin.find(function (err, linkedins) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, linkedins);
    });
};

// Get a single linkedin
exports.show = function (req, res) {
    Linkedin.findById(req.params.id, function (err, linkedin) {
        if (err) {
            return handleError(res, err);
        }
        if (!linkedin) {
            return res.send(404);
        }
        return res.json(linkedin);
    });
};

// Creates a new linkedin in the DB.
exports.create = function (req, res) {
    Linkedin.create(req.body, function (err, linkedin) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, linkedin);
    });
};

// Updates an existing linkedin in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Linkedin.findById(req.params.id, function (err, linkedin) {
        if (err) {
            return handleError(res, err);
        }
        if (!linkedin) {
            return res.send(404);
        }
        var updated = _.merge(linkedin, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, linkedin);
        });
    });
};

// Deletes a linkedin from the DB.
exports.destroy = function (req, res) {
    Linkedin.findById(req.params.id, function (err, linkedin) {
        if (err) {
            return handleError(res, err);
        }
        if (!linkedin) {
            return res.send(404);
        }
        linkedin.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

exports.getDefault = function (req, res) {
    Linkedin.findOne({
        'default': true
    }, {}, function (err, linkedin) {
        if (err) {
            return handleError(res, err);
        }
        if (!linkedin) {
            return res.send(500, 'No Default CV Present');
        }
        Skill.find(function (err, skills) {
           console.log(skills); 
        });
        res.json(linkedin);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}