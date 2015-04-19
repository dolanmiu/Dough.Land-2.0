/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Linkedin = require('./linkedin.model');

exports.register = function(socket) {
  Linkedin.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Linkedin.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('linkedin:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('linkedin:remove', doc);
}