import * as Koa from 'koa';
import * as session from 'koa-session';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static';
import { Strategy as LocalStrategy } from 'passport-local'
import { IWError } from './util/IWError';
import { hash, verify } from './auth/digest';
import User from './models/user';

// Initialize of Koa application.
const app = new Koa();
const router = new Router();

app.use(serve('public'));
app.use(bodyParser());

app.keys = [process.env.SESSION_KEYS || ' keys'];
const CONFIG = {
    key: 'sess:key',  /** (string) cookie key */
    maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
    overwrite: true,  /** (boolean) can overwrite or not (default true) */
    httpOnly: true,   /** (boolean) httpOnly or not (default true) */
    signed: true,     /** (boolean) signed or not (default true) */
    rolling: false,   /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,     /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

app.use(passport.initialize());
app.use(passport.session());

app.use(async (ctx, next) => {
    console.log('session')
    console.log(ctx.session)
    await next();
})

// Passport setup.
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
                throw new IWError(410, `Cannot find user with email: ${email}`);
            }
            const valid = await verify(password, user.pwd);
            if (!valid) {
                throw new IWError(403, `Incorrect password for user: ${user.name}`);
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Routes setup.
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

app.use(router.routes());

export default app;