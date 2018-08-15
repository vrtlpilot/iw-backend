import * as Koa from 'koa';
import * as session from 'koa-session';
import * as passport from 'koa-passport';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static';
import applyAuthMiddleware from './auth';

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

applyAuthMiddleware(router);

app.use(router.routes());

export default app;