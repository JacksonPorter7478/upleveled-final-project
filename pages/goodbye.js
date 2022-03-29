import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getFullUserByToken } from '../util/database';

export default function Goodbye() {
  return (
    <>
      <Head>
        <title>Buddies - find your people</title>
        <meta
          name="description"
          content="Buddies. The chat app to find your people in Vienna."
        />
      </Head>
      <p>All the best for your future adventures!</p>
      <br />
      <Link href="/">
        <a
          style={{
            textDecoration: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="flexColumn"
        >
          <Image
            src="/paperIcon.png"
            alt="Loading your profile..."
            width="90vw"
            height="90vw"
          />
          <h1 className="h1Font">Buddies</h1>
        </a>
      </Link>
    </>
  );
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
