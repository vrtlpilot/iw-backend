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
        createUser(name: String!, pwd: String!, email: String!): User!
        updateUser(id: ID!, name: String, company: String, location: String): User!
        removeUser(id: ID!): User!
    }
`);

// Types definition.
const Types = gql(`
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Employment {
        company: String!
        postition: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        pwd: String!
        phone: String
        job: Employment
        photo: File
        avatar: File
        location: String
        clinks: [String]
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