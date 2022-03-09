import crypto from 'node:crypto';
import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { createSerializedSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByEmail,
  getUserWithHashByEmail,
} from '../../util/database';

// create a new user
export async function createUserWithHash(name, bio, email, pw) {
  // make that inputs are non-empty strings
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

  // error if the email is already connected to a user
  if (await getUserByEmail(email)) {
    throw new UserInputError(
      'A profile with this email address already exists.',
    );
  }

  // hash the pw and create a user in the database
  try {
    const pwhash = await bcrypt.hash(pw, 12);
    const user = await createUser(name, bio, email, pwhash);
    return user;
  } catch (err) {
    throw new Error('Problem creating the user: ' + err);
  }
}

// The login mutation resolver decides whether or not the password is correct.
// If it isn't, it rejects the request. If the password is correct, it sets a cookie
// on the response header and returns true.
// sign in a user
export async function signIn(email, pw) {
  // check that email and pw are non-empty strings
  if (typeof email !== 'string' || !email) {
    throw new UserInputError('Please type in your email address');
  }
  if (typeof pw !== 'string' || !pw) {
    throw new UserInputError('Please provide a password');
  }

  // get the user from the database (error if user doesn't exist)
  const user = await getUserWithHashByEmail(email);
  if (!user) {
    throw new UserInputError('Login information incorrect');
  }

  // compare the pw with the hash (error if pw wrong)
  const passwordCorrect = await bcrypt.compare(pw, user.pwhash);
  if (!passwordCorrect) {
    throw new UserInputError('Login information incorrect');
  }

  // 1. create a unique token
  const token = crypto.randomBytes(64).toString('base64');
  // 2. create a session
  const session = await createSession(token, user.id);
  // 3. serialize the cookie
  const serializedCookie = await createSerializedSessionTokenCookie(token);

  return [user.id, serializedCookie];
}
