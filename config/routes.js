module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/users', users.create);

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/me', users.me);
    app.get('/users/:userId', users.show);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Jogas Routes
    var jogasok = require('../app/controllers/jogasok');
    app.get('/jogasok', jogasok.all);
    app.post('/jogasok', auth.requiresLogin, jogasok.create);
    app.get('/jogasok/:jogasId', auth.requiresLogin, jogasok.show);
    app.post('/jogasok/:jogasId', auth.requiresLogin, jogasok.update);
    app.del('/jogasok/:jogasId', auth.requiresLogin, jogasok.destroy);
    app.post('/jogasok/:jogasId/ujBerlet', auth.requiresLogin, jogasok.ujBerlet);
    app.param('jogasId', jogasok.jogas);

    // Alkalmak Routes
    var alkalmak = require('../app/controllers/alkalmak');
    app.get('/alkalmak', alkalmak.all);
    app.post('/alkalmak', auth.requiresLogin, alkalmak.create);
    app.get('/alkalmak/:alkalomId', auth.requiresLogin, alkalmak.show);
    app.post('/alkalmak/:alkalomId', auth.requiresLogin, alkalmak.update);
    app.del('/alkalmak/:alkalomId', auth.requiresLogin, alkalmak.destroy);
    app.post('/alkalmak/:alkalomId/addResztvevo', auth.requiresLogin, alkalmak.addResztvevo);
    app.param('alkalomId', alkalmak.alkalom);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);

};
