var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require("../models/User");
var http = require("https");

module.exports = function(router) {
    router.use(passport.initialize());
    router.use(passport.session());
    router.get("/auth/logout", logout);

    router.get("/auth/twitter", passport.authenticate('twitter'));
    router.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/presentation',
        failureRedirect: '/auth/login'
    }));
    router.get("/auth/google", passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/presentation',
        failureRedirect: '/auth/login'
    }));
    router.get("/auth/facebook", passport.authenticate('facebook', {
        scope: ['email', 'user_friends']
    }));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/presentation',
        failureRedirect: '/auth/login'
    }));

    return router;
};

function getFriends(user, token) {
    var url = 'https://graph.facebook.com/v2.3/' + user.facebook.id +
        '/friends?access_token=' + token +
        '&format=json&limit=100&method=get&offset=0&pretty=0&suppress_http_code=1';
    http.get(url, function(res) {
        if (res.statusCode == 200) {
            res.on('data', function(d) {
                var friends = JSON.parse(d);
                for (var f in friends.data) {
                    user.friends.push(friends.data[f].id);
                }
                user.save();
            });
        }
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

passport.use(new FacebookStrategy({
        // clientID: '1565765353704922',
        // clientSecret: '666d78ca6c88b1bb4203eab145b00d11',
        // callbackURL: 'http://companion.techtc.org/auth/facebook/callback',
        clientID: '1568052446809546',
        clientSecret: '13118636d44ab3eb6610cf2e0359771d',
        callbackURL: 'http://uccompanion-jgimbel.c9.io/auth/facebook/callback',
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
                getFriends(user, token);
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
                        getFriends(user, token);
                        return done(null, user);

                    }
                    else {
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;
                        getFriends(user, token);
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
        clientID: '852719821762-5ojmh50u423k29ra7q6p0g1rna8duvdm.apps.googleusercontent.com',
        clientSecret: 'oQMr1VzSbg9DqfWiaIuM5ThB',
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
        consumerKey: 'Syp6QbxciD01zxJmIQdP7GKP8',
        consumerSecret: 'PN6jMTbQ2Cv1AvztdbdkV1EDNAL4AIpyGOL5zF8UfCoSJhP7gq',
        callbackURL: 'http://companion.techtc.org/auth/twitter/callback',
        //callbackURL: 'http://jgimbel-uccompanion.c9.io/auth/twitter/callback',
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

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

function logout(req, res, next) {
    req.logout();
    res.redirect('/');
}
