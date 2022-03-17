import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
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

export const matchingQuery = gql`
  query ($activities: String!) {
    matchingUsers(activities: $activities) {
      name
      bio
      activities
    }
  }
`;

export const loggedIn = gql`
  mutation ($email: String!, $pw: String!, $csrfToken: String!) {
    logUserIn(email: $email, pw: $pw, csrfToken: $csrfToken) {
      id
    }
  }
`;

export const createMutation = gql`
  mutation (
    $name: String!
    $bio: String!
    $email: String!
    $pw: String!
    $csrfToken: String!
  ) {
    createUser(
      name: $name
      bio: $bio
      email: $email
      pw: $pw
      csrfToken: $csrfToken
    ) {
      id
      name
      bio
      email
    }
  }
`;

export const updateMutation = gql`
  mutation ($id: ID!, $name: String!, $bio: String!) {
    updateUser(id: $id, name: $name, bio: $bio) {
      id
      name
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
