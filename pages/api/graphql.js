import { ApolloServer, UserInputError } from 'apollo-server';
import bcrypt from 'bcrypt';
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUsers,
  getUserWithHashByEmail,
  updateUser,
} from '../../util/database';
import { typeDefs } from './schema';

async function createUserWithHash(name, bio, email, pw) {
  if (typeof name !== 'string' || !name) {
    throw new UserInputError('Please provide a name');
  }
  if (typeof bio !== 'string' || !bio) {
    throw new UserInputError('Please provide some information about yourself');
  }
  if (typeof email !== 'string' || !email) {
    throw new UserInputError('Please provide a valid email address');
  }
  if (typeof pw !== 'string' || !pw) {
    throw new UserInputError('Please provide a password');
  }

  if (await getUserByEmail(email)) {
    throw new UserInputError(
      'A profile with this email address already exists.',
    );
  }

  try {
    const pwhash = await bcrypt.hash(pw, 12);
    const user = await createUser(name, bio, email, pwhash);
    return user;
  } catch (err) {
    throw new Error('Problem creating the user: ' + err);
  }
}

async function userWithHash(email, pw) {
  if (typeof email !== 'string' || !email) {
    throw new UserInputError('Please type in your email address');
  }
  if (typeof pw !== 'string' || !pw) {
    throw new UserInputError('Please provide a password');
  }

  const user = await getUserWithHashByEmail(email);
  if (!user) {
    throw new UserInputError('Login information incorrect');
  }

  const passwordCorrect = await bcrypt.compare(pw, user.pwhash);
  if (!passwordCorrect) {
    throw new UserInputError('Login information incorrect');
  }

  return user.id;
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
    loggedInUser(parents, args) {
      return userWithHash(args.email, args.pw);
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
