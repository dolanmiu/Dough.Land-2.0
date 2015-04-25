/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Github = require('./github.model');

exports.register = function(socket) {
  Github.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Github.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('github:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('github:remove', doc);
}