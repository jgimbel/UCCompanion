var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require("../models/User");
module.exports = function(router) {
    router.use(passport.initialize());
    router.use(passport.session());
    
    router.get("/auth/twitter", passport.authenticate('twitter'));
    router.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login'
    }));
    router.get("/auth/google", passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login'
    }));
    router.get("/auth/facebook", passport.authenticate('facebook', {
        scope: ['email', 'user_friends']
    }));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login'
    }));
    
    return router;
};

passport.use(new FacebookStrategy({
        clientID: '1565765353704922',
        clientSecret: '666d78ca6c88b1bb4203eab145b00d11',
        callbackURL: 'http://companion.techtc.org/auth/facebook/callback',
        passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {

        process.nextTick(function() {
            if (req.user) {
                var user = req.user; // pull the user out of the session

                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });
            }
            else {
                User.findOne({
                    'facebook.id': profile.id
                }, function(err, user) {

                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }
        });

    }));

//Google
passport.use(new GoogleStrategy({
        clientID: '917734437865-chv0ft83fqvj5gen12orrgkv12n900gj.apps.googleusercontent.com',
        clientSecret: 'w3wUBnkUaU9oIFzWvlK_B1bC',
        callbackURL: 'https://companion.techtc.org/auth/google/callback',
        passReqToCallback: true

    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            if (req.user) {
                var user = req.user;
                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = profile.emails[0].value; // pull the first email
                user.save(function(err) {
                    if (err) {
                        throw (err);
                    }
                    return done(null, user);
                });
            }
            else {

                User.findOne({
                    'google.id': profile.id
                }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        newUser.save(function(err) {
                            if (err) {
                                throw (err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            }
        });
    }));

//twitter
passport.use(new TwitterStrategy({
        consumerKey: 'gVkkCZ7BnNjgxxA5MRTcLevQ5',
        consumerSecret: 'g3WjjFzUiBFZTEReJCuf3V31eWBEmV3siWfW0uLDtQcuSqdSsT',
        callbackURL: "https://companion.techtc.org/auth/twitter/callback",
        passReqToCallback: true

    },
    function(req, token, tokenSecret, profile, done) {
        process.nextTick(function() {
            if (req.user) {
                var user = req.user;
                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
            else {

                User.findOne({
                    'twitter.id': profile.id
                }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }
        });
    }));