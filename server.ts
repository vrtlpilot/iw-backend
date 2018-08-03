import * as Koa from 'koa';
import { ApolloServer} from 'apollo-server-koa';
import  typeDefs from './schema';
import resolvers from './resolvers';
import database from './db';

// Create the server
const server = new ApolloServer({ typeDefs, resolvers });

// Init koa
const app = new Koa();
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
