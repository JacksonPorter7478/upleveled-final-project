exports.up = async (sql) => {
  await sql`
		CREATE TABLE activities (
			id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
			title varchar(30) NOT NULL
		)`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE activities
		`;
};
