import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser  from 'koa-bodyparser';
import { ApolloServer} from 'apollo-server-koa';
import  typeDefs from './schema';
import resolvers from './resolvers';
import database from './db';
import { signUp, login } from './src/auth';

// Create the server
const server = new ApolloServer({ typeDefs, resolvers });

// Init koa
const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.post('/signup', async (ctx) => {
  const { username, email, password } = ctx.request.body;
  const token = await signUp(username, email, password);
  ctx.body = { token };
});

router.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await login(email, password);
  ctx.body = { token };
});

app.use(router.routes());

server.applyMiddleware({ app });

// Init DB
const db = database();
db.then(info => {
  const _port = process.env.PORT || 4000;
  app.listen({ port: _port}, () =>
    console.log(`Server listening at http://localhost:${_port}${server.graphqlPath}`),
  );
}).catch((err) => {
    console.error(err);
    process.exit(1);
  });
