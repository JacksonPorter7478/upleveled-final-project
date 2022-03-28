import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();
config();

// Type for the connection function below
// declare module globalThis {
//   let postgresSqlClient: ReturnType<typeof postgres> | undefined;
// }

// Connect only once to the database
function connectOnceToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

// Connect to PostgreSQL
const sql = connectOnceToDatabase();

// SESSIONS

export async function deleteExpiredSessions() {
  const sessions = await sql`
  DELETE FROM
    sessions
  WHERE
    expiry < NOW()
  RETURNING
    *
  `;
  return sessions.map((session) => camelcaseKeys(session));
}

export async function deleteByToken(token) {
  const session = await sql`
  DELETE FROM
    sessions
  WHERE
    token = ${token}
  RETURNING
    *
  `;
  return camelcaseKeys(session);
}

export async function getSessionByToken(token) {
  const session = await sql`
  SELECT
    *
  FROM
    sessions
  WHERE
    token = ${token} AND
    expiry > NOW()
  `;

  return camelcaseKeys(session[0]);
}

export async function createSession(token, userId) {
  const session = await sql`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
  RETURNING
    id,
    token,
    user_id
  `;
  await deleteExpiredSessions();
  return camelcaseKeys(session[0]);
}

// ACTIVITIES

export async function getActivities() {
  const activities = await sql`
    SELECT
      *
    FROM
      activities`;
  return activities;
}

// USER_ACTIVITIES

export async function insertIntoUserActivities(userId, activityId) {
  const userActivities = await sql`
    INSERT INTO user_activities
      ( user_id, activity_id )
    VALUES
      ( ${userId}, ${activityId} )
    RETURNING
      user_id
      activity_id
  `;
  return camelcaseKeys(userActivities[0]);
}

export async function deleteUserActivities(userId) {
  await sql`
    DELETE FROM
      user_activities
    WHERE
      user_id = ${userId}
    RETURNING
      *
  `;
  return { id: userId };
}

export async function getActivitiesByUserId(userId) {
  const activities = await sql`
  SELECT
    activities.id,
    activities.title
  FROM
    user_activities,
    activities
  WHERE
    user_id = ${userId} AND
    activities.id = activity_id

  `;
  const userActivities = activities.filter((a) => a.id);
  return camelcaseKeys(userActivities);
}

// USERS queries

export async function getUsers() {
  const users = await sql`
    SELECT
      id,
      name,
      avatar,
      bio,
      email
    FROM
      users`;
  return users;
}

export async function getUserById(id) {
  const user = await sql`
    SELECT
      id,
      name,
      avatar,
      bio,
      email
    FROM
      users
    WHERE id= ${id}
    `;
  return user[0];
}

export async function getUserByEmail(email) {
  const user = await sql`
    SELECT
      email
    FROM
      users
    WHERE email= ${email}
    `;
  return user[0];
}

export async function getUserWithHashByEmail(email) {
  const user = await sql`
    SELECT
      id,
      email,
      pwhash
    FROM
      users
    WHERE email= ${email}
    `;
  return user[0];
}

export async function getFullUserByToken(token) {
  if (!token) return undefined;

  await deleteExpiredSessions();
  const user = await sql`
  SELECT
    users.id,
    users.name,
    users.avatar,
    users.bio
  FROM
    sessions,
    users
  WHERE
    sessions.token = ${token} AND
    sessions.user_id = users.id
  `;

  return camelcaseKeys(user[0]);
}

// USER mutations

export async function createUser(name, avatar, bio, email, pwhash) {
  const user = await sql`
    INSERT INTO users
      ( name, avatar, bio, email, pwhash )
    VALUES
      ( ${name}, ${avatar}, ${bio}, ${email}, ${pwhash} )
    RETURNING
      id, name, avatar, bio`;
  return user[0];
}

export async function updateUser(id, name, avatar, bio) {
  const updatedUserValue = await sql`
    UPDATE users
    SET
      name = ${name}, avatar = ${avatar}, bio = ${bio}
    WHERE
      id = ${id}
    RETURNING
      id, name, avatar, bio, email`;
  return updatedUserValue[0];
}

export async function deleteUserFromDb(id) {
  const name = await getUserById(id);
  await sql`
  DELETE FROM
    users
  WHERE
    id = ${id}
  RETURNING
    *
  `;
  await deleteUserActivities(id);
  return name.name;
}

// CHAT

export async function createChat(name, userId) {
  const chat = await sql`
    INSERT INTO chats
      ( name, user_id )
    VALUES
      ( ${name}, ${userId})
    RETURNING
      id, name, user_id`;
  return camelcaseKeys(chat[0]);
}

export async function deleteChat(chatId) {
  const chat = await sql`
    DELETE FROM
    chats
  WHERE
    id = ${chatId}
  RETURNING
    *
  `;
  return camelcaseKeys(chat[0]);
}

export async function addUsersToChat(userId, chatId) {
  const chatUsers = await sql`
    INSERT INTO chat_users
      ( user_id, chat_id )
    VALUES
      ( ${userId}, ${chatId} )
    RETURNING
      user_id
      chat_id
  `;
  return camelcaseKeys(chatUsers[0]);
}

export async function deleteUserFromChat(userId, chatId) {
  await sql`
    DELETE FROM
     chat_users
    WHERE
      chat_id = ${chatId} AND
      user_id = ${userId}
  `;
  return camelcaseKeys({ userId, chatId });
}

export async function getChatsByUserId(userId) {
  const chats = await sql`
  SELECT
    chats.id,
    chats.name
  FROM
    chat_users,
    chats
  WHERE
    chat_users.user_id = ${userId} AND
    chats.id = chat_id

  `;
  const userChats = chats.filter((c) => c.id);
  return camelcaseKeys(userChats);
}

export async function getChatById(id) {
  const chat = await sql`
    SELECT
      *
    FROM
      chats
    WHERE
      id = ${id}
    `;
  return camelcaseKeys(chat[0]);
}

export async function getChatMembersByChatId(chatId) {
  const members = await sql`
  SELECT
    users.id,
    users.name,
    users.avatar
  FROM
    chat_users,
    users
  WHERE
    chat_id = ${chatId} AND
    users.id = user_id

  `;
  const chatMembers = members.filter((a) => a.id);
  return camelcaseKeys(chatMembers);
}

// MESSAGES

export async function createMessage(userId, chatId, content, name) {
  const message = await sql`
    INSERT INTO messages
      ( user_id, chat_id, content, name )
    VALUES
      ( ${userId}, ${chatId}, ${content}, ${name})
    RETURNING
      id, user_id, chat_id, content, name, timestamp
      `;
  return camelcaseKeys(message[0]);
}
export async function deleteMessages(chatId) {
  const message = await sql`
    DELETE FROM
    messages
  WHERE
    chat_id = ${chatId}
  RETURNING
    *
  `;
  return camelcaseKeys(message[0]);
}

export async function getMessagesByChatId(chatId) {
  const message = await sql`
    SELECT
      id, user_id, chat_id, TO_CHAR(timestamp, 'HH24:MI:SS-DDMonYYYY') as timestamp, content, name
    FROM
      messages
    WHERE chat_id= ${chatId}
    `;
  const messageHistory = message.filter((m) => m.id);
  return camelcaseKeys(messageHistory);
}
