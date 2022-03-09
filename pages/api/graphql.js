import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import { getUserById, getUsers, updateUser } from '../../util/database';
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
    createUser(parents, args) {
      return createUserWithHash(args.name, args.bio, args.email, args.pw);
    },
    updateUser(parents, args) {
      return updateUser(Number(args.id), args.name, args.bio, args.email);
    },
    logAUserIn(parents, args, context) {
      const [serializedCookie, userId] = signIn(args.email, args.pw);
      // 4. add the cookie to the header
      context.res.setHeader('Set-Cookie', serializedCookie);
      return userId;
    },
  },
};

async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);
  // Same ApolloServer initialization, plus the drain plugin.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context(ctx) {
      return { ...ctx };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,
    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: '/',
  });

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch((error) => console.log(error));

// this was the code when i used apollo-server, not apollo-server-express
// // The ApolloServer constructor requires two parameters: a schema definition and a set of resolvers.
// const server = new ApolloServer({ typeDefs, resolvers });

// // The `listen` method launches a web server.
// server
//   .listen()
//   .then(() => {
//     console.log(`🚀  Server ready at port 4000`);
//   })
//   .catch((error) => console.log(error));
