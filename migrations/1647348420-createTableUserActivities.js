exports.up = async (sql) => {
  await sql`
		CREATE TABLE user_activities (
			PRIMARY KEY (user_id, activity_id),
			user_id integer REFERENCES users (id) ON DELETE CASCADE,
			activity_id integer REFERENCES activities (id) ON DELETE CASCADE
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE user_activities
		`;
};
