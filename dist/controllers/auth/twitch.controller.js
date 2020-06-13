"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = tslib_1.__importStar(require("express"));
const passport_1 = tslib_1.__importDefault(require("passport"));
var twitchStrategy = require('passport-twitch-new').Strategy;
require('dotenv').config();
passport_1.default.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/twitch/callback`,
    scope: 'user_read',
    customHeaders: {
        'client-id': process.env.TWITCH_CLIENT_ID,
    },
}, function (accessToken, refreshToken, profile, done) {
    console.log(`Authenticated: `, accessToken, refreshToken, profile);
    // Create or Update credentials here
    done(null, profile);
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
class TwitchController {
    constructor() {
        this.path = '/auth/twitch';
        this.router = express.Router();
        this.callback = (req, res) => {
            res.render('posts/index', res);
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path, passport_1.default.authenticate('twitch'));
        this.router.get(this.path + '/callback', passport_1.default.authenticate('twitch', { failureRedirect: '/' }), this.callback);
    }
}
exports.default = TwitchController;
//# sourceMappingURL=twitch.controller.js.map