import passport from 'passport';
require('dotenv').config();

const twitchStrategy = require('passport-twitch-new').Strategy;

const initTwitchPassport = ({ faunaDb }) => {
  passport.use(
    new twitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_SECRET,
        callbackURL: `${process.env.HOST}/auth/twitch/callback`,
        scope: 'user_read channel:read:subscriptions',
        customHeaders: {
          'client-id': process.env.TWITCH_CLIENT_ID,
        },
      },
      async function (accessToken, refreshToken, profile, done) {
        if (profile.id !== '120750024') {
          return done('Unauthorized', null)
        }

        const doc = await faunaDb.query.findByIndex('authentications_by_provider', 'twitch').execute();
        const data = {
          uid: profile.id,
          provider: profile.provider,
          accessToken,
          refreshToken,
          data: profile,
        };

        // Create or Update credentials here
        if (doc) {
          await faunaDb.query.update(doc.ref, data).execute();
        } else {
          await faunaDb.query.create('authentications', data).execute();
        }
        done(null, profile);
      },
    ),
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  return passport
}

export default initTwitchPassport
