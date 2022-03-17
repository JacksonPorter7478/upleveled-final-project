import { gql } from '@apollo/client';

// A schema is a collection of type definitions that together define the "shape" of queries
export const typeDefs = gql`
  type User {
    id: ID
    name: String
    bio: String
    email: String
    pwhash: String
  }
  type Id {
    id: ID
  }
  type Name {
    name: String
  }
  type UserActivities {
    userId: ID
    activityId: ID
  }
  type Error {
    error: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(
      name: String!
      bio: String!
      email: String!
      pw: String!
      csrfToken: String!
    ): User

    updateUser(id: ID!, name: String!, bio: String!): User

    logUserIn(email: String!, pw: String!, csrfToken: String!): Id

    addUserActivities(userId: ID!, activityId: ID!): UserActivities

    deleteAllUserActivities(userId: ID!): Id

    deleteUser(id: ID!): Name
  }
`;
