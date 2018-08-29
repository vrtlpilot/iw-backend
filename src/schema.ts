import QueryImpl from './resolvers/query';
import MutationImpl from './resolvers/mutation';
import { gql, Config } from "apollo-server";


// Query definition.
const Query = gql(`
    type Query {
        getPool(poolId: String!): Pool
        searchPool(poolName: String!): [PoolInfo!]!
    }
`);

// Mutation definition.
const Mutation = gql(`
    type Mutation {
        updateUser(input: UserInput!): User!
        createPool(input: PoolInput!): String!
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

    input PoolInput {
        poolName: String!
        holderOfPool: ID!
        projectName: String!
        projectLink: String!
        projectAdress: String!
        poolSoftCap: Float!
        poolHardCap: Float!
        minDeposit: Float!
        maxDeposit: Float!
        endDate: String!
        comissionOfHolder: Float!
        addressForComissionPayment: String!
        comissionOfIcoWorld: Float!
    }

    type Pool {
        poolId: String!
        poolName: String!
        verifyContractLink: String!
        holderOfPool: ID!
        projectName: String!
        projectAdress: String!
        poolSoftCap: Float!
        poolHardCap: Float!
        minDeposit: Float!
        maxDeposit: Float!
        endDate: String!
        comissionOfHolder: Float!
        comissionOfIcoWorld: Float!
    }

    type PoolInfo {
        poolId: String!
        poolName: String!
        holderOfPool: ID!
        projectName: String!
        endDate: String!
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