// import Cookies from 'js-cookie';
import Link from 'next/link';
import Header from '../../components/Header';
import { getActivitiesByUserId, getFullUserByToken } from '../../util/database';

export default function User(props) {
  return (
    <>
      {props.error && <h1>{props.error}</h1>}
      {props.user && (
        <>
          <Header user={props.user} />
          <h1 className="h1Font">Hi, {props.user.name}</h1>
          <p>Your bio: {props.user.bio}</p>
          Your categories:
          {props.activities.map((a) => {
            return <div key={`user-activities-${a.id}`}>{a.title}</div>;
          })}{' '}
          <Link href="/profile">
            <a>Edit profile</a>
          </Link>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;
  // get the user by token
  const user = await getFullUserByToken(token);
  if (user) {
    // if there is a user, get their activities
    const activities = await getActivitiesByUserId(user.id);
    return {
      props: { user, activities },
    };
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
