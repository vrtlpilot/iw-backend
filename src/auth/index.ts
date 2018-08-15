import User from '../models/user';
import * as passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local'
import {IWError} from '../util/IWError';
import {hash, verify} from './digest';


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
      pwd: await hash(password)
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
      const valid = await verify(password,  user.pwd);
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
        const { message, status } = err;
        ctx.body = { error: message };
        ctx.status = Number.parseInt(status);
      } else if (!user) {
        ctx.body = { error: 'Incorrect password' };
      } else {
        await ctx.login(user);
        ctx.body = user;
      }
    })(ctx, next);
  });

  router.get('/logout', async (ctx) => {
    await ctx.logout();
    ctx.body = 'logout';
  });
}