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

// get all users
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

export async function updateUser(id, name, bio, email) {
  const updatedUserValue = await sql`
    UPDATE users
    SET
      name = ${name}, bio = ${bio}, email= ${email}
    WHERE
      id = ${id}
    RETURNING
      id, name, bio, email`;
  return updatedUserValue[0];
}
