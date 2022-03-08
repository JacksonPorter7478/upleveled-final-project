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

  type Query {
    users: [User]
    user(id: ID!): User
    loggedInUser(email: String!, pw: String!): ID
  }

  type Mutation {
    createUser(name: String!, bio: String!, email: String!, pw: String!): User
    updateUser(id: ID!, name: String, bio: String, email: String): User
  }
`;
