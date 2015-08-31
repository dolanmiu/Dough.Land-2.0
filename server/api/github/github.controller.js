'use strict';

var _ = require('lodash');
var Github = require('./github.model');
var request = require('request');

// Get list of githubs
exports.index = function(req, res) {
  request('https://www.kimonolabs.com/api/azqq1x7m?apikey=0dc941efa2f0a2807d63c75b5010706f&kimmodify=1', function (err, response, body) {
    if(err) { return handleError(res, err); }
    if (response.statusCode === 200) {
      res.setHeader('Content-Type', 'application/json');
      return res.json(200, JSON.parse(body));
    } else {
        return res.send(response.statusCode, body);   
    }
  })
};

// Get a single github
exports.show = function(req, res) {
  Github.findById(req.params.id, function (err, github) {
    if(err) { return handleError(res, err); }
    if(!github) { return res.send(404); }
    return res.json(github);
  });
};

// Creates a new github in the DB.
exports.create = function(req, res) {
  Github.create(req.body, function(err, github) {
    if(err) { return handleError(res, err); }
    return res.json(201, github);
  });
};

// Updates an existing github in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Github.findById(req.params.id, function (err, github) {
    if (err) { return handleError(res, err); }
    if(!github) { return res.send(404); }
    var updated = _.merge(github, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, github);
    });
  });
};

// Deletes a github from the DB.
exports.destroy = function(req, res) {
  Github.findById(req.params.id, function (err, github) {
    if(err) { return handleError(res, err); }
    if(!github) { return res.send(404); }
    github.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}