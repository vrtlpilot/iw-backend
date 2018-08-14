import * as Koa from 'koa';
import * as session from 'koa-session';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static';
/* import { signUp, login } from './auth'; */
import applyAuthMiddleware from './auth';

// Initialize of Koa application.
const app = new Koa();
const router = new Router();

app.use(serve('public'));
app.use(bodyParser());

app.keys = [/* process.env.SESSION_KEYS */' keys'];
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

// Signup request handler.
/* router.post('/signup', async (ctx:Koa.Context) => {
    const { firstName, lastName, email, password } = ctx.request.body as any;
    const token = await signUp(firstName, lastName, email, password);
    ctx.body = { token };
});

// Login request handler.
router.post('/login', async (ctx:Koa.Context) => {
    const { email, password } = ctx.request.body as any;
    try {
        const token = await login(email, password);
        ctx.body = { token };
    } catch(err) {
        // should be IWError type error.
        ctx.throw(err.status, err.message);
    }
}); */

applyAuthMiddleware(router);

// Logout request handler.
router.get('/logout', async (ctx:Koa.Context) => {
    ctx.logout();
});
app.use(router.routes());

export default app;