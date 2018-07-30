import * as Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';
 
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    check: String
  }`;
 
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    check: () => 'Ping from apollo!',
  },
};
 
const server = new ApolloServer({ typeDefs, resolvers });
 
const app = new Koa();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log(`Server listening at http://localhost:4000${server.graphqlPath}`),
);