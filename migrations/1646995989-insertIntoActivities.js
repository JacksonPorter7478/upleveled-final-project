const activitiesList = [
  { title: 'Hiking' },
  { title: 'Gym' },
  { title: 'Team Sports' },
  { title: 'Outdoor activities' },
  { title: 'Dancing' },
  { title: 'Cinema' },
  { title: 'Concerts' },
  { title: 'Climbing' },
  { title: 'Theater' },
  { title: 'Museums' },
  { title: 'Pubs & Bars' },
  { title: 'Restaurants & Cafés' },
  { title: 'Arts & Crafts' },
  { title: 'Running' },
  { title: 'Lectures & Discussions' },
];

exports.up = async (sql) => {
  await sql`
	INSERT INTO activities
		${sql(activitiesList, 'title')}
	`;
};

exports.down = async (sql) => {
  for (const activity of activitiesList) {
    await sql`
			DELETE FROM
				activities
			WHERE
				title = ${activity.title}
	`;
  }
};
