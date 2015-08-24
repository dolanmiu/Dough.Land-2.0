/*globals require, module */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SkillSchema = new Schema({
    name: String,
    level: Number
});

module.exports = mongoose.model('Skill', SkillSchema);