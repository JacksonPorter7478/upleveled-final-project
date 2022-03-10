import { gql } from '@apollo/client';

// A schema is a collection of type definitions that together define the "shape" of queries
export const typeDefs = gql`
  type User {
    id: ID
    name: String!
    bio: String!
    email: String!
    pwhash: String!
  }
  type Id {
    id: ID
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, bio: String!, email: String!, pw: String!): User
    updateUser(id: ID!, name: String!, bio: String!, email: String!): User
    logUserIn(email: String!, pw: String!): Id
  }
`;
