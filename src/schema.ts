import Resolvers from './resolvers';
import { gql, Config } from "apollo-server";


// Query definition.
const Query = gql(`
    type Query {
        user(id: ID!): User!
        users(name: String, email: String): [User!]
    }
`);

// Mutation definition.
const Mutation = gql(`
    type Mutation {
        createUser(name: String!, email: String!, company: String!): User!
        updateUser(id: ID!, name: String, email: String, company: String): User!
        removeUser(id: ID!): User!
    }
`);

// Types definition.
const Types = gql(`
    type User {
        id: ID!
        name: String!
        email: String!
        company: String!
    }
`);


// Construct a config which contains typedefs and resolvers.
const config:Config = {
  typeDefs: [
    Query, Mutation, Types
  ],
  resolvers: Resolvers,
};

export default config;