import QueryImpl from './resolvers/query';
import MutationImpl from './resolvers/mutation';
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
        updateUser(input: UserInput!): User!
        removeUser(id: ID!): User!

        upload(file: Upload!): File!
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
        position: String!
    }

    type Clinks {
        fb: String
        linkedin: String
        insta: String
        twitter: String
        telegram: String
        wechat: String
    }

    type User {
        id: ID!
        name: String!
        email: String!
        phone: String
        job: Employment
        country: String
        city: String
        education: String
        clinks: Clinks
    }

    input EmploymentInput {
        company: String!
        position: String!
    }

    input CLinksInput {
        fb: String
        linkedin: String
        insta: String
        twitter: String
        telegram: String
        wechat: String
    }

    input UserInput {
        id: ID!
        name: String        
        email: String
        education: String
        phone: String
        country: String
        city: String
        job: EmploymentInput
        clinks: CLinksInput
    }
`);

// Construct a config which contains typedefs and resolvers.
const config: Config = {
    typeDefs: [
        Query, Mutation, Types
    ],
    resolvers: {
        Query: QueryImpl,
        Mutation: MutationImpl
    },
};

export default config;