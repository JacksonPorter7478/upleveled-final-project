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
  type UserActivities {
    userId: ID
    activityId: ID
  }
  type Error {
    error: String!
  }
  type Match {
    name: String!
    bio: String!
    activities: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    matchingUsers(activities: String!): [Match]
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
  }
`;
