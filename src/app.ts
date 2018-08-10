import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { signUp, login } from './auth';

// Initialize of Koa application.
const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Signup request handler.
router.post('/signup', async (ctx:Koa.Context) => {
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
});

app.use(router.routes());

export default app;