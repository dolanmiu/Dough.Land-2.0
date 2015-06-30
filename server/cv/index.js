/*globals require, module */
var express = require('express');

var controller = require('./controller');
var config = require('../config/environment');

var router = express.Router();

router.get('/download', controller.download);

module.exports = router;