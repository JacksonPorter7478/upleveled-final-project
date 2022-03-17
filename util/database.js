import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

config();

// Type for the connection function below
// declare module globalThis {
//   let postgresSqlClient: ReturnType<typeof postgres> | undefined;
// }

// Connect only once to the database
function connectOnceToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres();
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
    token
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

export async function createUser(name, bio, email, pwhash) {
  const user = await sql`
    INSERT INTO users
      ( name, bio, email, pwhash )
    VALUES
      ( ${name}, ${bio}, ${email}, ${pwhash} )
    RETURNING
      id, name, bio, email`;
  return user[0];
}

export async function updateUser(id, name, bio) {
  const updatedUserValue = await sql`
    UPDATE users
    SET
      name = ${name}, bio = ${bio}
    WHERE
      id = ${id}
    RETURNING
      id, name, bio, email`;
  return updatedUserValue[0];
}

export async function deleteUserFromDb(id) {
  const name = await getUserById(id);
  const user = await sql`
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
