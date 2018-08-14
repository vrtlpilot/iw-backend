/* import * as jsonwebtoken from 'jsonwebtoken'; */
import User from '../models/user';
import * as crypto from 'crypto';
import { Hash } from 'crypto';

/*
const secret = process.env.PWD_SEED || 'secret';

// Create JWT token.
function createToken(userData, options): string {
  const { secret } = options;
  return jsonwebtoken.sign(userData, secret);
}
*/

// Digest a given data parameter.
function createDigest(data): string {
  const hash: Hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

/*
// Signup request definition.
export async function signUp(firstName: string, lastName: string, email: string, password: string): Promise<string> {
  const userData = {
    name: `${firstName} ${lastName}`,
    email,
    pwd: createDigest(password)
  }
  const user = new User(userData);
  const { _id, name } = (await user.save()) as any;
  return createToken({ id: _id, name }, { secret });
}

// Login request definition.
export async function login(email: string, password: string): Promise<string> {
  const user = await User.findOne({ email }) as any;
  if (!user) {
    throw new IWError(401, `Cannot find user with email: ${email}`);
  }
  const isValidPassword = createDigest(password) === user.pwd;
  if (!isValidPassword) {
    throw new IWError(401, `Incorrect password for user: ${user.name}`);
  }
  return createToken({ id: user._id, name: user.name }, { secret });
}
 */

import * as passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local'

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId: any, done) => {
  const user = await User.findById(userId);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  async function(ctx, email, password, done) {
    const { firstName, lastName } = ctx.body;
    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      pwd: createDigest(password)
    };
    const user = await User.create(userData);
    return done(null, user);
  }
));

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
  },
  async (email, password, done) => {
    const user = await User.findOne({ email }) as any;
    if (!user) {
      // throw new IWError(401, `Cannot find user with email: ${email}`)
      done(new Error(`Cannot find user with email: ${email}`));
    }
    const isValidPassword = createDigest(password) === user.pwd;
    if (!isValidPassword) {
      //  new IWError(401, `Incorrect password for user: ${user.name}`);
      done(null, false);
    }
    done(null, user);
  })
);


export default function(router) {
  router.post('/signup', passport.authenticate('local-signup',), async (ctx) => {
    const user = ctx.state.user;
    ctx.body = { user };
  });

  /* router.post('/signup', async (ctx, next) => {
    await passport.authenticate('local-signup', (err, user) => {
      if (err) {
        const { message } = err;
        ctx.body = { message };
      } else {
        ctx.body = { user };
      }
    })(ctx, next);
  }); */

  /* router.post('/login', passport.authenticate('local-login'), (ctx) => {
      const user = ctx.state.user;
      ctx.body = { name: user };
    }
  ); */

  router.post('/login', async (ctx, next) => {
    await passport.authenticate('local-login', async (err, user, info) => {
      if (err) {
        const { message } = err;
        ctx.body = { error: message };
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

  /* router.get('/success', async (ctx) => {
    ctx.body = 'success'
  }) */

  /* router.get('/fail', async (ctx) => {
    ctx.body = 'fail'
  }) */
}