import { gql } from '@apollo/client';

// A schema is a collection of type definitions that together define the "shape" of queries
export const typeDefs = gql`
  type User {
    id: ID
    name: String
    bio: String
    email: String
    pwhash: String
    avatar: String
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
  type ChatUser {
    userId: ID
    chatId: ID
  }
  type Chat {
    id: ID
    name: String
  }
  type Message {
    id: ID
    userId: ID
    chatId: ID
    content: String
    timestamp: String
    name: String
  }
  type Error {
    error: String
  }

  type Query {
    users: [User]
    user: User
    messageHistory(chatId: ID!): [Message]
  }

  type Mutation {
    createUser(
      name: String!
      avatar: String
      bio: String!
      email: String!
      pw: String!
      csrfToken: String!
    ): User

    updateUser(id: ID!, name: String!, avatar: String, bio: String!): User

    logUserIn(email: String!, pw: String!, csrfToken: String!): Id

    addUserActivities(userId: ID!, activityId: ID!): UserActivities

    deleteAllUserActivities(userId: ID!): Id

    deleteUser(id: ID!): Name

    createNewChat(name: String!): Chat

    addChatUser(userId: ID!, chatId: ID!): ChatUser

    deleteChatUser(userId: ID!, chatId: ID!): ChatUser

    storeMessage(chatId: ID!, content: String!, name: String!): Message
  }
`;
