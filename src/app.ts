import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { signUp, login } from './auth';

// Init koa app
const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.post('/signup', async (ctx) => {
    const { username, email, password } = ctx.request.body as any;
    const token = await signUp(username, email, password);
    ctx.body = { token };
});

router.post('/login', async (ctx) => {
    const { email, password } = ctx.request.body as any;
    const token = await login(email, password);
    ctx.body = { token };
});

app.use(router.routes());

export default app;