import { ServerResponse } from 'node:http';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUserActivities,
  deleteUserFromDb,
  getSessionByToken,
  getUserById,
  getUsers,
  insertIntoUserActivities,
  updateUser,
} from '../../util/database';
import { createUserWithHash, signIn } from './resolverFunctions';
import { typeDefs } from './schema';

type Args = {
  id: number;
  userId: number;
  activityId: number;
  name: string;
  bio: string;
  email: string;
  pw: string;
  csrfToken: string;
};

// Resolvers define the technique for fetching the types defined in the schema
const resolvers = {
  Query: {
    async users() {
      return await getUsers();
    },
    async user(parent: void, args: Args) {
      return await getUserById(Number(args.id));
    },
  },

  Mutation: {
    async createUser(
      parent: void,
      args: Args,
      context: { res: ServerResponse },
    ) {
      const [serializedCookie, user] = await createUserWithHash(
        args.name,
        args.bio,
        args.email,
        args.pw,
        args.csrfToken,
      );
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return user;
    },
    async updateUser(parent: void, args: Args, context: { error: string }) {
      if (context.error) {
        return context.error;
      }
      return await updateUser(Number(args.id), args.name, args.bio);
    },
    async logUserIn(
      parent: void,
      args: Args,
      context: { res: ServerResponse },
    ) {
      console.log('err');
      const [serializedCookie, user] = await signIn(
        args.email,
        args.pw,
        args.csrfToken,
      );
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return { id: user.id };
    },
    async addUserActivities(
      parents: void,
      args: Args,
      context: { error: string },
    ) {
      if (context.error) {
        return context.error;
      }
      return await insertIntoUserActivities(args.userId, args.activityId);
    },
    async deleteAllUserActivities(
      parents: void,
      args: Args,
      context: { error: string },
    ) {
      if (context.error) {
        return context.error;
      }
      return await deleteUserActivities(args.userId);
    },
    async deleteUser(parent: void, args: Args, context: { error: string }) {
      if (context.error) {
        return context.error;
      }
      const deletedUser = await deleteUserFromDb(args.id);
      return { name: deletedUser };
    },
  },
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    // get the token from the headers
    const token = (await req.cookies.sessionToken) || '';
    // if there is no token, error
    if (!token) {
      const error = 'Please log in';
      return { error, res };
    }
    // use the token to get the user's id. if there is none, error
    const session = await getSessionByToken(token);
    if (!session) {
      const error = 'Please log in';
      return { error, res };
    }
    // if the token finds a user, return the session
    return { session, res };
  },
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD',
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}
