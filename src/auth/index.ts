import User from '../models/user';
import * as crypto from 'crypto';
import { Hash } from 'crypto';
import * as passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local'

// Digest a given data parameter.
function createDigest(data): string {
  const hash: Hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId: any, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
  async function (ctx, email, password, done) {
    const { firstName, lastName } = ctx.body;
    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      pwd: createDigest(password)
    };
    try {
      const user = await User.create(userData);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }) as any;
      // Check an user.
      if (!user) {
        throw new IWError(401, `Cannot find user with email: ${email}`);
      }
      const valid = createDigest(password) === user.pwd;
      if (!valid) {
        throw new IWError(401, `Incorrect password for user: ${user.name}`);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

export default function (router) {
  router.post('/signup', async (ctx, next) => {
    await passport.authenticate('local-signup', async (err, user) => {
      if (err) {
        const { message } = err;
        ctx.body = { error: message };
      } else {
        await ctx.login(user);
        ctx.body = { user };
      }
    })(ctx, next);
  });

  router.post('/login', async (ctx, next) => {
    await passport.authenticate('local-login', async (err, user) => {
      if (err) {
        const { message } = err;
        ctx.body = { error: message };
      } else if (!user) {
        ctx.body = { error: 'Incorrect password' };
      } else {
        await ctx.login(user);
        ctx.body = user;
      }
    })(ctx, next);
  });

  router.post('/logout', async (ctx) => {
    await ctx.logout();
    ctx.body = 'logout';
  });
}