import { gql } from '@apollo/client';

// A schema is a collection of type definitions that together define the "shape" of queries
export const typeDefs = gql`
  type User {
    id: ID
    name: String
    avatar: String
    bio: String
    email: String
    error: String
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
    userId: ID
    error: String
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
    message: String
  }
  type Login {
    id: ID
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

    logUserIn(email: String!, pw: String!, csrfToken: String!): Login

    addUserActivities(userId: ID!, activityId: ID!): UserActivities

    deleteAllUserActivities(userId: ID!): Id

    deleteUser(id: ID!): Name

    createNewChat(name: String!): Chat

    addChatUser(userId: ID!, chatId: ID!): ChatUser

    deleteChatUser(userId: ID!, chatId: ID!): ChatUser

    storeMessage(chatId: ID!, content: String!, name: String!): Message

    deleteChatAndMessages(chatId: ID!): Chat
  }
`;
