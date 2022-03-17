import { getActivitiesByUserId, getUsers } from './database';

type ActivitiesObj = { id: number; title: string };
type UserId = { id: number };
type UsersActivityLists = { userId: number; activities: string[] };

export default async function matchUsers(id: number) {
  // use the id to get the user's activities
  const currentUserActivities: ActivitiesObj[] = await getActivitiesByUserId(
    id,
  );
  // put only the activity titles into an array
  const currentUsersChoices = currentUserActivities.map((activity) => {
    return activity.title;
  });

  // get a list of all users
  const users: UserId[] = await getUsers();

  // this will be a list of all users connected to their chosen activities
  let usersActivityLists: UsersActivityLists[] | [] = [];

  for (const user of users) {
    // exclude the current user
    if (user.id === id) {
      continue;
    }
    // get each users' activities
    const userActivities: ActivitiesObj[] = await getActivitiesByUserId(
      user.id,
    );

    // usersActivityLists: an array of objects, each with a userId and an array of activity titles
    // [ {userId: , activities: ['title', 'title']} ]
    usersActivityLists = [
      ...usersActivityLists,
      {
        userId: user.id,
        activities: userActivities.map((activity) => {
          return activity.title;
        }),
      },
    ];
  }

  // list ONLY matching activities
  const matchingActivities: UsersActivityLists[] = usersActivityLists.map(
    (userList) => {
      return {
        userId: userList.userId,
        activities: userList.activities.filter((activity) => {
          return currentUsersChoices.includes(activity);
        }),
      };
    },
  );

  // list the users who have min 2 activities in common
  const matches: number[] = matchingActivities.reduce(
    (previousValue: number[], currentValue: UsersActivityLists) => {
      if (currentValue.activities.length > 1) {
        return [...previousValue, currentValue.userId];
      }
      return previousValue;
    },
    [],
  );

  return matches;
}
