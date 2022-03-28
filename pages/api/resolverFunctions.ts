import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { verifyCsrfToken } from '../../util/auth';
import { createSerializedSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByEmail,
  getUserWithHashByEmail,
} from '../../util/database';
import { UserInfo } from '../../util/types';

// CREATE a new user
export async function createUserWithHash(
  name: string,
  avatar: string,
  bio: string,
  email: string,
  pw: string,
  csrfToken: string,
) {
  // ensure that inputs are non-empty strings
  if (typeof name !== 'string' || !name) {
    return ['Please provide a name'];
  }
  if (typeof avatar !== 'string' || !avatar) {
    return ['Please choose a profile avatar'];
  }
  if (typeof bio !== 'string' || !bio) {
    return ['Please provide some information about yourself'];
  }
  if (typeof email !== 'string' || !email) {
    return ['Please provide a valid email address'];
  }
  if (typeof pw !== 'string' || !pw) {
    return ['Please provide a password'];
  }
  if (typeof csrfToken !== 'string' || !csrfToken) {
    return ['CSRF token not provided'];
  }
  // check the csrf token for validity
  const csrfTokenMatches = verifyCsrfToken(csrfToken);
  if (!csrfTokenMatches) {
    return ['Invalid CSRF token'];
  }

  // error if the email is already connected to a user
  if (await getUserByEmail(email)) {
    return ['A profile with this email address already exists.'];
  }

  try {
    // hash the pw and create a user in the database
    const pwhash = await bcrypt.hash(pw, 12);
    const user: UserInfo = await createUser(name, avatar, bio, email, pwhash);

    // 1. create a unique token
    const token = crypto.randomBytes(64).toString('base64');
    // 2. create a session
    await createSession(token, user.id);
    // 3. serialize the cookie
    const serializedCookie = await createSerializedSessionTokenCookie(token);
    return [null, serializedCookie, user];
  } catch (err) {
    return ['Problem creating the user'];
  }
}

// SIGN IN a user
export async function signIn(email: string, pw: string, csrfToken: string) {
  // check that email and pw are non-empty strings
  if (typeof email !== 'string' || !email) {
    return ['Please type in your email address'];
  }
  if (typeof pw !== 'string' || !pw) {
    return ['Please provide a password'];
  }
  if (typeof csrfToken !== 'string' || !csrfToken) {
    return ['No csrf token was provided'];
  }
  // check the csrf token is valid
  const csrfTokenMatches = verifyCsrfToken(csrfToken);
  if (!csrfTokenMatches) {
    return ['Invalid CSRF token'];
  }
  // get the user from the database (error if user doesn't exist)
  const user: { id: number; pwhash: string } | undefined =
    await getUserWithHashByEmail(email);
  if (!user) {
    return ['Login information incorrect'];
  }

  // compare the pw with the hash (error if pw wrong)
  const passwordCorrect = await bcrypt.compare(pw, user.pwhash);
  if (!passwordCorrect) {
    return ['Login information incorrect'];
  }
  // 1. create a unique token
  const token = crypto.randomBytes(64).toString('base64');
  // 2. create a session
  await createSession(token, user.id);
  // 3. serialize the cookie
  const serializedCookie = await createSerializedSessionTokenCookie(token);

  return [null, serializedCookie, user];
}
