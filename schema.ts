import { gql } from 'apollo-server-koa';

// Construct a schema, using SDL.
export default gql(`
  type Query {
    user(id: ID!): User!
    users(name: String, email: String): [User!]
  }

  type Mutation {
    createUser(name: String!, email: String!, company: String!): User!
    updateUser(id: ID!, name: String, email: String, company: String): User!
    removeUser(id: ID!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    company: String!
  }
  `);