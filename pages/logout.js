import { serialize } from 'cookie';
import { deleteByToken } from '../util/database';

export default function Logout() {
  return <>you are now logged out</>;
}

export async function getServerSideProps(context) {
  // get the token in the cookies from context
  const token = context.req.cookies.sessionToken;

  if (token) {
    // delete session from database using the token
    await deleteByToken(token);
    // delete the cookie
    context.res.setHeader(
      'Set-Cookie',
      serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
