import app from './app';
import { ApolloServer} from 'apollo-server-koa';
import  schema from './schema';
import database from './db';

// Create the server
const server = new ApolloServer(schema);
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
