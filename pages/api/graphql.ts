import { ServerResponse } from 'node:http';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUsersToChat,
  createChat,
  createMessage,
  deleteUserActivities,
  deleteUserFromChat,
  deleteUserFromDb,
  getMessagesByChatId,
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
  avatar: string;
  bio: string;
  email: string;
  pw: string;
  csrfToken: string;
  chatId: number;
  content: string;
};

// Resolvers define the technique for fetching the types defined in the schema
const resolvers = {
  Query: {
    async users() {
      return await getUsers();
    },
    async user(
      parent: void,
      args: Args,
      context: { error: string; session: { userId: number } },
    ) {
      if (context.error) {
        throw new Error('Please log in');
      }
      return await getUserById(context.session.userId);
    },
    async messageHistory(
      parent: void,
      args: Args,
      context: { error: string; session: { userId: number } },
    ) {
      if (context.error) {
        return context.error;
      }
      // check here if the userId and chatId share a row in the join table

      return await getMessagesByChatId(args.chatId);
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
        args.avatar,
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
      return await updateUser(
        Number(args.id),
        args.name,
        args.avatar,
        args.bio,
      );
    },
    async deleteUser(parent: void, args: Args, context: { error: string }) {
      if (context.error) {
        return context.error;
      }
      const deletedUser = await deleteUserFromDb(args.id);
      return { name: deletedUser };
    },
    async logUserIn(
      parent: void,
      args: Args,
      context: { res: ServerResponse },
    ) {
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
    async createNewChat(
      parents: void,
      args: Args,
      context: { error: string; session: { userId: number } },
    ) {
      if (context.error) {
        return context.error;
      }
      // first create the chat table -name
      const chat = await createChat(args.name);
      // add the user who starts the chat to the join table
      await addUsersToChat(context.session.userId, chat.id);
      return chat;
    },
    async addChatUser(
      parents: void,
      args: Args,
      context: { error: string; session: { userId: number } },
    ) {
      if (context.error) {
        return context.error;
      }
      // check if the current user is authorized to add someone to the chat
      return await addUsersToChat(args.userId, args.chatId);
    },
    async deleteChatUser(
      parents: void,
      args: Args,
      context: { error: string; session: { userId: number } },
    ) {
      console.log(context.session.userId);
      console.log(args.userId);
      if (context.error) {
        throw new Error(context.error);
      }
      // check that the user can only delete themselves from a chat
      if (Number(context.session.userId) !== Number(args.userId)) {
        throw new Error(
          'You are not allowed to delete someone else from a chat',
        );
      }
      return await deleteUserFromChat(args.userId, args.chatId);
    },
    async storeMessage(
      parents: void,
      args: Args,
      context: { error: string; session: { userId: number } },
    ) {
      if (context.error) {
        return context.error;
      }

      return await createMessage(
        context.session.userId,
        args.chatId,
        args.content,
        args.name,
      );
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
