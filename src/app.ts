import * as Koa from 'koa';
import * as session from 'koa-session';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static';
import * as cors from 'koa2-cors';
import { Strategy as LocalStrategy } from 'passport-local'
import { IWError } from './util/IWError';
import { hash, verify } from './auth/digest';
import User, {setUserRole, getUserData} from './models/user';
import {deployContract} from './eth/contracts';
import admin from './admin';

// Initialize of Koa application.
const app = new Koa();
const router = new Router();

app.use(serve('public'));
app.use(bodyParser());

// cors
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Coockie sign keys.
app.keys = [process.env.SESSION_KEYS || '97Jix8Mcc4G+CD02iunYB6sZTjXxQfks'];
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

/* app.use(async (ctx, next) => {
    console.log('session')
    console.log(ctx.session)
    await next();
}) */

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
        try {
            let user = await User.findOne({ email }) as any;
            if(user)
                throw new IWError(409, `There's an account already registered to email: ${email}`);
            const userData = {
                name: `${firstName} ${lastName}`,
                email,
                pwd: await hash(password)
            };
            user = await User.create(userData);
            user.save();
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

// Signup request handler.
router.post('/signup', async (ctx, next) => {
    await passport.authenticate('local-signup', async (err, user) => {
        if (err) {
            const { message } = err;
            ctx.body = { error: message };
        } else {
            await ctx.login(user);
            setUserRole(user);
            ctx.body = getUserData(user);
        }
    })(ctx, next);
});

// Login request handler.
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
            ctx.body = getUserData(user);
        }
    })(ctx, next);
});

// Logout request handler.
router.get('/logout', async (ctx) => {
    await ctx.logout();
    ctx.body = 'logout';
});

// Contract deploy request handler.
router.post('/deploy', async (ctx:Koa.Context) => {
    try {
        if(ctx.session == undefined || null)
            throw new IWError(401, "Access denied");
        const { name, args } = ctx.request.body as any;
        const data = await deployContract(name, args);
        ctx.body = { data };
    } catch(err) {
        // should be IWError type error.
        ctx.throw(err.status, err.message);
    }
});

router.get('/', async (ctx: Koa.Context) => {
    ctx.body = 'icoWorld'
})

// admin api
app.use(admin);

app.use(router.routes());

export default app;