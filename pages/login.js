import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createCsrfToken } from '../util/auth';
import { getSessionByToken } from '../util/database';
import { loggedIn } from './api/client';

const formStyles = css`
  align-items: center;
  input {
    border-radius: 4px;
    border: 2px solid powderblue;
  }
  button {
    margin-top: 20px;
  }
`;

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();
  const [getLoggedInUser, { loading, error }] = useMutation(loggedIn);

  async function loginHandler(event) {
    event.preventDefault();
    try {
      const userId = await getLoggedInUser({
        variables: { email: email, pw: pw, csrfToken: props.csrfToken },
      }).catch((err) => console.log(err));

      if (typeof userId.data.logUserIn.id !== 'string') {
        return;
      }
      await router.push(`/users/${userId.data.logUserIn.id}`);
    } catch (err) {
      console.log('Error logging in: ' + err);
    }
  }

  if (loading) return 'Loading...';

  return (
    <>
      <h1 className="h1Font">Sign in</h1>
      {error && <h2>{error.message}</h2>}
      <form
        css={formStyles}
        className="flexColumn"
        onSubmit={(event) => loginHandler(event)}
      >
        <div>
          <label>
            Email
            <br />
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </label>
          <br />
          <label>
            Password
            <br />
            <input
              type="password"
              required
              value={pw}
              onChange={(event) => setPw(event.currentTarget.value)}
            />
          </label>
          <br />
        </div>
        <button className="buttonStyles">Sign in</button>
        <Link href="/register">
          <a>Go to Signup</a>
        </Link>
      </form>
    </>
  );
}

export async function getServerSideProps(context) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;

  // if there is, redirect
  if (token) {
    const session = await getSessionByToken(token);
    if (session) {
      return {
        redirect: {
          destination: `/users/${session.userId}`,
          permanent: false,
        },
      };
    }
  }
  // otherwise create a csrf token and render this login page
  return {
    props: {
      csrfToken: createCsrfToken(),
    },
  };
}
