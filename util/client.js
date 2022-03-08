import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
  headers: {
    authorization: 'Bearer users',
    // add the login token here
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

export const loggedIn = gql`
  query ($email: String!, $pw: String!) {
    loggedInUser(email: $email, pw: $pw)
  }
`;

export const createMutation = gql`
  mutation ($name: String!, $bio: String!, $email: String!, $pw: String!) {
    createUser(name: $name, bio: $bio, email: $email, pw: $pw) {
      id
      name
      bio
      email
    }
  }
`;

export const updateMutation = gql`
  mutation ($id: ID!, $name: String, $bio: String, $email: String) {
    updateUser(id: $id, name: $name, bio: $bio, email: $email) {
      id
      bio
      name
      email
    }
  }
`;
