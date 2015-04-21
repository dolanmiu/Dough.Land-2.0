/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Cv = require('./cv.model');

exports.register = function(socket) {
  Cv.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Cv.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('cv:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('cv:remove', doc);
}