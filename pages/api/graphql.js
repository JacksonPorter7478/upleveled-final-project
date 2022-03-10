import { ApolloServer } from 'apollo-server-micro';
import {
  getUserById,
  getUserByToken,
  getUsers,
  updateUser,
} from '../../util/database';
import { createUserWithHash, signIn } from './resolverFunctions';
import { typeDefs } from './schema';

// Resolvers define the technique for fetching the types defined in the schema
const resolvers = {
  Query: {
    users() {
      return getUsers();
    },
    user(parent, args) {
      return getUserById(Number(args.id));
    },
  },
  Mutation: {
    async createUser(parents, args, context) {
      const [serializedCookie, user] = await createUserWithHash(
        args.name,
        args.bio,
        args.email,
        args.pw,
      );
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return user;
    },
    async updateUser(parents, args) {
      return await updateUser(Number(args.id), args.name, args.bio, args.email);
    },
    async logUserIn(parents, args, context) {
      const [serializedCookie, user] = await signIn(args.email, args.pw);
      // add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return { id: user.id };
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
  context({ res }) {
    return { res };
  },
});

const startServer = apolloServer.start();

export default async function handler(req, res) {
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
