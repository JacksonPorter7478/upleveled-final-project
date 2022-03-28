exports.up = async (sql) => {
  await sql`
		CREATE TABLE messages (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			user_id integer REFERENCES users (id),
			chat_id integer REFERENCES chats (id),
			timestamp timestamp NOT NULL DEFAULT NOW(),
			content varchar(600) NOT NULL,
			name varchar(30) NOT NULL
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE messages
		`;
};
