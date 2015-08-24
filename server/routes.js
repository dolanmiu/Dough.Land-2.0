/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function (app) {

    // Insert routes below
    app.use('/api/skills', require('./api/skill'));
    app.use('/api/github', require('./api/github'));
    app.use('/api/linkedin', require('./api/linkedin'));
    app.use('/api/things', require('./api/thing'));

    app.use('/cv', require('./cv'));
    
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

    //Update Page
    app.route('/profile').get(function (req, res) {
        res.sendfile(app.get('appPath') + '/update.html');
    });

    // All other routes should redirect to the index.html
    app.route('/*').get(function (req, res) {
        res.sendfile(app.get('appPath') + '/index.html');
    });
};