/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Skill = require('./skill.model');

exports.register = function(socket) {
  Skill.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Skill.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('skill:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('skill:remove', doc);
}