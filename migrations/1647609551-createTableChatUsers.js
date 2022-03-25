exports.up = async (sql) => {
  await sql`
		CREATE TABLE chat_users (
			PRIMARY KEY (user_id, chat_id),
			user_id integer REFERENCES users (id) ON DELETE CASCADE,
			chat_id integer REFERENCES chats (id) ON DELETE CASCADE
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE chat_users
		`;
};
