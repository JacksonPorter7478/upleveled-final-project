import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Header from '../components/Header';
import {
  getActivitiesByUserId,
  getFullUserByToken,
  getUserById,
} from '../util/database';
import matchUsers from '../util/match';

const userStyles = css`
  background-color: #e0f4f7;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 25px;
  h3 {
    text-align: center;
    margin: 0;
    font-size: 20px;
  }
  .bio {
    border-radius: 6px;
    margin: 10px;
    background-color: white;
    padding: 10px;
    font-size: 20px;
  }
  .activity {
    text-align: justify;
  }
`;
type User = { id: number; name: string; bio: string };
type UserActivities = { id: number; title: string };
type MatchesList = { matchInfo: User; matchActivities: UserActivities[] };
type Props = {
  currentUser: User;
  matchesList: MatchesList[];
};

export default function Dashboard(props: Props) {
  // i want to:
  // fetch only users who have at least 2 activities in common with the current user
  //

  return (
    <>
      <Header user={props.currentUser} />
      <h1>Welcome back, {props.currentUser.name}</h1>
      <h2>Make plans with...</h2>
      {props.matchesList.map((m) => {
        return (
          <div key={`dashboard-users-${m.matchInfo.id}`} css={userStyles}>
            <h3>{m.matchInfo.name}</h3>
            <p className="bio">{m.matchInfo.bio}</p>
            {m.matchActivities.map((activity) => {
              return (
                <p
                  className="activity"
                  key={`dashboard-${m.matchInfo.id}-activity-${activity.id}`}
                >
                  {activity.title}
                </p>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // check if there is already a valid token in the cookie and get the corresponding user
  const token = context.req.cookies.sessionToken;
  const currentUser = await getFullUserByToken(token);

  // if there is a user, get their matches
  if (currentUser) {
    const matches = await matchUsers(currentUser.id);

    // for each match, i want an object in the array: { matchInfo: {id: , name: , bio: }, matchActivities: [title: ]}
    let matchesList: MatchesList[] | [] = [];

    for (const match of matches) {
      const matchInfo: User = await getUserById(match);
      const matchActivities: UserActivities[] = await getActivitiesByUserId(
        match,
      );

      const matchingUser = { matchInfo, matchActivities };

      matchesList = [...matchesList, matchingUser];
    }

    return {
      props: {
        currentUser,
        matchesList,
      },
    };
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}

// TODOS

// X match users
// O Chat
// X context
// X authentication
