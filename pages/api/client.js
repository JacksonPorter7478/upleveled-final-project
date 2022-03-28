import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: '/api/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
  headers: {
    authorization: 'Bearer token',
  },
});

export const usersQuery = gql`
  query {
    users {
      id
      name
      bio
      email
    }
  }
`;
export const userByContextQuery = gql`
  query {
    user {
      id
      name
      bio
      email
      avatar
    }
  }
`;

export const loggedIn = gql`
  mutation ($email: String!, $pw: String!, $csrfToken: String!) {
    logUserIn(email: $email, pw: $pw, csrfToken: $csrfToken) {
      id
      error
    }
  }
`;

export const createMutation = gql`
  mutation (
    $name: String!
    $avatar: String!
    $bio: String!
    $email: String!
    $pw: String!
    $csrfToken: String!
  ) {
    createUser(
      name: $name
      avatar: $avatar
      bio: $bio
      email: $email
      pw: $pw
      csrfToken: $csrfToken
    ) {
      id
      name
      avatar
      bio
      email
      error
    }
  }
`;

export const updateMutation = gql`
  mutation ($id: ID!, $name: String!, $avatar: String!, $bio: String!) {
    updateUser(id: $id, name: $name, avatar: $avatar, bio: $bio) {
      id
      name
      avatar
      bio
      email
    }
  }
`;

export const addActivity = gql`
  mutation ($userId: ID!, $activityId: ID!) {
    addUserActivities(userId: $userId, activityId: $activityId) {
      userId
      activityId
    }
  }
`;

export const deleteUserActivities = gql`
  mutation ($userId: ID!) {
    deleteAllUserActivities(userId: $userId) {
      id
    }
  }
`;

export const deleteMutation = gql`
  mutation ($id: ID!) {
    deleteUser(id: $id) {
      name
    }
  }
`;

export const createChatMutation = gql`
  mutation ($name: String!) {
    createNewChat(name: $name) {
      id
      name
      userId
      error
    }
  }
`;

export const chatUserMutation = gql`
  mutation ($userId: ID!, $chatId: ID!) {
    addChatUser(userId: $userId, chatId: $chatId) {
      userId
      chatId
    }
  }
`;

export const chatUserDeleteMutation = gql`
  mutation ($userId: ID!, $chatId: ID!) {
    deleteChatUser(userId: $userId, chatId: $chatId) {
      userId
      chatId
    }
  }
`;

export const createMsgMutation = gql`
  mutation ($chatId: ID!, $content: String!, $name: String!) {
    storeMessage(chatId: $chatId, content: $content, name: $name) {
      id
      userId
      chatId
      content
      name
      timestamp
    }
  }
`;

export const messageHistoryQuery = gql`
  query ($chatId: ID!) {
    messageHistory(chatId: $chatId) {
      id
      userId
      chatId
      content
      name
      timestamp
    }
  }
`;

export const deleteChatMutation = gql`
  mutation ($chatId: ID!) {
    deleteChatAndMessages(chatId: $chatId) {
      id
      name
      userId
      error
    }
  }
`;
