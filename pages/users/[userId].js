import { getUserById } from '../../util/database';

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
  // get the userId from the url
  const userId = context.query.userId;

  const user = await getUserById(userId);

  if (!user) {
    context.res.statusCode = 404;
    return { props: { error: 'There is no user with this ID' } };
  }

  return {
    props: {
      user,
    },
  };
}
