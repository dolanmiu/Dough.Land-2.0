/*globals require, module */
var mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate'),
    Schema = mongoose.Schema;


var SkillSchema = new Schema({
    name: String,
    level: Number
});

SkillSchema.plugin(findOrCreate);

module.exports = mongoose.model('Skill', SkillSchema);