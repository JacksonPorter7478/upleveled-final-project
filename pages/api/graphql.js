import { ApolloServer } from 'apollo-server';
import bcrypt from 'bcrypt';
import {
  createUser,
  getUserById,
  getUsers,
  updateUser,
} from '../../util/database';
import { typeDefs } from './schema';

async function createUserWithHash(name, bio, email, pw) {
  try {
    const pwhash = await bcrypt.hash(pw, 12);
    const user = await createUser(name, bio, email, pwhash);
    return user;
  } catch (err) {
    throw new Error('Problem hashing the pw or creating the user: ' + err);
  }
}

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
  },
};

// The ApolloServer constructor requires two parameters: a schema definition and a set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server
  .listen()
  .then(() => {
    console.log(`🚀  Server ready at port 4000`);
  })
  .catch((error) => console.log(error));
