import passport from 'passport';
const refresh = require('passport-oauth2-refresh');
require('dotenv').config();
import { Strategy, Profile, VerifyCallback, User } from '@oauth-everything/passport-patreon'

const initPatreonPassport = ({ faunaDb }) => {
  const strategy = new Strategy(
    {
      clientID: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_SECRET,
      scope: 'identity campaigns campaigns.members',
      callbackURL: `${process.env.HOST}/auth/patreon/callback`,
    },
    async function (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback<User>) {
      if (process.env.PATREON_ADMIN_USER.toLowerCase() !== profile.username) {
        return done(new Error('Unauthorized'), null)
      }

      const doc = await faunaDb.query.findByIndex('authentications_by_provider', 'patreon').execute();
      const data = {
        uid: profile.id,
        provider: profile.provider,
        accessToken,
        refreshToken,
        profile,
      };

      // Create or Update credentials here
      if (doc) {
        await faunaDb.query.update(doc.ref, data).execute();
      } else {
        await faunaDb.query.create('authentications', data).execute();
      }

      const user: User = {
        email: "",
        first_name: profile.displayName,
        last_name: "",
        full_name: "",
        is_email_verified: true,
        vanity: "",
        about: "",
        image_url: "",
        thumb_url: "",
        can_see_nsfw: false,
        created: "",
        url: "",
        like_count: 0,
        hide_pledges: false,
        social_connections: null,
      }

      done(null, user);
    },
  )

  passport.use(strategy);
  refresh.use(strategy);

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  return passport
}

export default initPatreonPassport
