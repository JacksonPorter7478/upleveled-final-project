import { getFullUserByToken } from '../util/database';

export default function Goodbye() {
  return <>All the best for your future adventures!</>;
}

export async function getServerSideProps(context) {
  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;
  // get the user by token
  const user = await getFullUserByToken(token);
  if (user) {
    return {
      redirect: {
        destination: `/users/${user.id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
