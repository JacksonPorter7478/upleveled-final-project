import { getSessionByToken, getUserById } from '../../util/database';

export default function User(props) {
  return (
    <>
      {props.error && <h1>{props.error}</h1>}
      {props.user && (
        <>
          <h1 className="h1Font">Hi, {props.user.name}</h1>
          <p>Your bio: {props.user.bio}</p>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;

  // if they are logged in
  if (token) {
    const session = await getSessionByToken(token);
    if (session) {
      // get the userId from the url
      const userId = context.query.userId;
      const user = await getUserById(userId);

      // give permission, if the user id from the token is the same as the page id
      const permission = Number(session.userId) === Number(userId);

      // if there's no user with this id, show custom error message
      if (!user) {
        context.res.statusCode = 404;
        return { props: { error: 'There is no user with this ID' } };
      }

      // pass the user, if they are the one logged in
      if (permission) {
        return {
          props: {
            user,
          },
        };
      }
      // logged in users trying to see someone else's page are redirected to their own profile
      return {
        redirect: {
          destination: `/users/${session.userId}`,
          permanent: false,
        },
      };
    }
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
