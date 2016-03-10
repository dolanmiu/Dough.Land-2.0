'use strict';

var express = require('express');
var controller = require('./image.controller');

var router = express.Router();

router.get('images/:term', controller.getImageFromTerm);

module.exports = router;