import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addUsersToChat,
  createChat,
  createMessage,
  deleteChat,
  deleteMessages,
  deleteUserActivities,
  deleteUserFromChat,
  deleteUserFromDb,
  getChatById,
  getChatMembersByChatId,
  getMessagesByChatId,
  getSessionByToken,
  getUserById,
  getUsers,
  insertIntoUserActivities,
  updateUser,
} from '../../util/database';
import {
  ChatMessage,
  ChatUser,
  Context,
  SecureUser,
  Security,
  UserActivityArgs,
  UserInfo,
} from '../../util/types';
import { createUserWithHash, signIn } from './resolverFunctions';
import { typeDefs } from './schema';

// Resolvers define the technique for fetching the types defined in the schema
const resolvers = {
  Query: {
    // only used in development in the apollo sandbox
    async users() {
      return await getUsers();
    },

    async user(parent: void, args: void, context: Context) {
      if ('error' in context) {
        return { error: context.error };
      }
      return await getUserById(context.session.userId);
    },

    async messageHistory(
      parent: void,
      args: { chatId: number },
      context: Context,
    ) {
      if ('error' in context) {
        return { error: context.error };
      }
      // check here if the current user is in this chat and allowed to see the messages
      const chatMembers: UserInfo[] = await getChatMembersByChatId(args.chatId);
      if (!chatMembers.some((member) => member.id === context.session.userId)) {
        return { error: 'You are not in this chat!' };
      }
      return await getMessagesByChatId(args.chatId);
    },
  },

  Mutation: {
    async createUser(parent: void, args: SecureUser, context: Context) {
      if ('session' in context) {
        return { error: 'Already logged in' };
      }
      const [error, serializedCookie, user] = await createUserWithHash(
        args.name,
        args.avatar,
        args.bio,
        args.email,
        args.pw,
        args.csrfToken,
      );
      if (error) {
        return { error };
      }
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return user;
    },

    async updateUser(parent: void, args: UserInfo, context: Context) {
      if ('error' in context) {
        return { error: context.error };
      }
      // ensure they are authorized for this action
      if (Number(args.id) !== Number(context.session.userId)) {
        return { error: 'You are only allowed to edit your own profile' };
      }
      return await updateUser(
        Number(context.session.userId),
        args.name,
        args.avatar,
        args.bio,
      );
    },

    async deleteUser(parent: void, args: { id: number }, context: Context) {
      if ('error' in context) {
        return { error: context.error };
      }
      // ensure they are authorized for this action
      if (Number(args.id) !== Number(context.session.userId)) {
        return { error: 'You are only allowed to delete your own profile' };
      }
      const deletedUser = await deleteUserFromDb(context.session.userId);
      return { name: deletedUser };
    },

    async logUserIn(parent: void, args: Security, context: Context) {
      const [error, serializedCookie, user] = await signIn(
        args.email,
        args.pw,
        args.csrfToken,
      );
      if ('session' in context) {
        return { error: 'Already logged in' };
      }
      if (error) {
        return { error };
      }
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return { id: user.id };
    },

    async addUserActivities(
      parents: void,
      args: UserActivityArgs,
      context: Context,
    ) {
      if ('error' in context) {
        return { error: context.error };
      }
      // ensure they are authorized for this action
      if (Number(args.userId) !== Number(context.session.userId)) {
        return { error: 'You are only allowed to edit your own profile' };
      }
      return await insertIntoUserActivities(
        context.session.userId,
        args.activityId,
      );
    },

    async deleteAllUserActivities(
      parents: void,
      args: { userId: number },
      context: Context,
    ) {
      if ('error' in context) {
        return { error: context.error };
      }
      // ensure they are authorized for this action
      if (Number(args.userId) !== Number(context.session.userId)) {
        return { error: 'You are only allowed to edit your own profile' };
      }
      return await deleteUserActivities(args.userId);
    },

    async createNewChat(
      parents: void,
      args: { name: string; userId: number },
      context: Context,
    ) {
      if ('error' in context) {
        return { error: context.error };
      }
      // first create the chat table
      const chat = await createChat(args.name, context.session.userId);
      // add the user who starts the chat to the join table
      await addUsersToChat(context.session.userId, chat.id);
      return chat;
    },

    async addChatUser(parents: void, args: ChatUser, context: Context) {
      if ('error' in context) {
        return { error: context.error };
      }
      // check if the current user is authorized to add someone to the chat
      const chat = await getChatById(args.chatId);
      if (chat.userId !== context.session.userId) {
        return { error: 'You are not allowed to add members to this chat' };
      }
      return await addUsersToChat(args.userId, args.chatId);
    },

    async deleteChatUser(parents: void, args: ChatUser, context: Context) {
      if ('error' in context) {
        return { error: context.error };
      }
      // check that the user can only delete themselves from a chat
      if (Number(context.session.userId) !== Number(args.userId)) {
        return {
          error: 'You are not allowed to delete someone else from a chat',
        };
      }
      return await deleteUserFromChat(args.userId, args.chatId);
    },

    async storeMessage(parents: void, args: ChatMessage, context: Context) {
      if ('error' in context) {
        return { error: context.error };
      }
      // ensure only chatMembers can add messages
      const chatMembers: UserInfo[] = await getChatMembersByChatId(args.chatId);
      if (!chatMembers.some((member) => member.id === context.session.userId)) {
        return { error: 'You are not in this chat!' };
      }
      return await createMessage(
        context.session.userId,
        args.chatId,
        args.content,
        args.name,
      );
    },

    async deleteChatAndMessages(
      parents: void,
      args: { chatId: number },
      context: Context,
    ) {
      if ('error' in context) {
        return { error: context.error };
      }
      // check if they're the admin
      const chat = await getChatById(args.chatId);
      if (chat.userId !== context.session.userId) {
        return { error: 'You do not have permission to delete this chat' };
      }
      // delete all messages in the chat
      await deleteMessages(args.chatId);
      // delete the chat
      return await deleteChat(args.chatId);
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
    return { session };
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
