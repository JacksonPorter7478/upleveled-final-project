import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import { getFullUserByToken, getSessionByToken } from '../util/database';

const header = css`
  display: flex;
  width: 100vw;
  margin-top: -6vh;
  padding: 20px;
  justify-content: space-around;
  border-bottom: solid;
  border-image-slice: 1;
  border-width: 4px;
  border-image-source: linear-gradient(
    to right,
    #05396b,
    #389583,
    #8de4af,
    #bff0d1
  );
  a:nth-of-type(2) {
    font-size: 26px;
    text-decoration: none;
  }
`;

const info = css`
  position: relative;
  margin-bottom: 25px;
  padding: 30px 0 20px 0;
  max-width: 650px;
  text-align: justify;
  border-bottom: solid;
  border-image-slice: 1;
  border-width: 4px;
  border-image-source: linear-gradient(
    to right,
    #05396b,
    #389583,
    #8de4af,
    #bff0d1
  );
  p {
    margin: 50px 0;
  }
  .icons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 20vw;
  }
`;

const credit = css`
  width: 100%;
  max-width: 650px;
  text-align: left;
  p {
    line-height: 1.3;
    margin: 0;
    font-size: 10px;
  }
`;

export default function About(props) {
  return (
    <>
      <Head>
        <title>About Buddies</title>
        <meta
          name="description"
          content="About Buddies - The chat app to find your people in Vienna. "
        />
      </Head>
      {props.currentUser ? (
        <Header user={props.currentUser} />
      ) : (
        <header css={header}>
          <Link href="/">
            <a>
              <Image src="/homeIcon.png" width="30px" height="30px" />
            </a>
          </Link>
          <Link href="/register">
            <a>Sign up</a>
          </Link>
        </header>
      )}
      <div css={info}>
        <h1 className="h1Font">About Buddies</h1>
        <p>
          You're new to Vienna and want to find connections? You want try a new
          hobby or be inspired by other people's ideas?
        </p>
        <div className="icons">
          <Image src="/musicIcon.png" height="25px" width="25px" alt="" />
          <Image src="/bowlingIcon.png" height="40px" width="40px" alt="" />
          <Image src="/coffeeIcon.png" height="25px" width="25px" alt="" />
        </div>
        <p>
          Buddies is a <strong>matching</strong> platform that gives you the
          opportunity to find people with similar <strong>interests</strong>.
        </p>
        <div className="icons">
          <Image src="/peopleIcon.png" height="25px" width="25px" alt="" />
          <Image src="/chatIcon.png" height="25px" width="25px" alt="" />
        </div>
        <p>
          You can reach out to a single person or start{' '}
          <strong>group chats</strong> with up to five of your matches each.
        </p>
      </div>
      <div css={credit}>
        <p>
          Baby duck photo by{' '}
          <a href="https://unsplash.com/@tunebasics?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Kerin Gedge
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </p>
        <p>
          Puppy photo by{' '}
          <a href="https://unsplash.com/@blueskiesburning?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Ignacio R
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </p>
        <p>
          Kitten photo by{' '}
          <a href="https://unsplash.com/@elodieoudot?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Elodie Oudot
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </p>
        <p>
          Picknick in a park photo by{' '}
          <a href="https://unsplash.com/@masondahl?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Mason Dahl
          </a>{' '}
          on{' '}
          <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </p>
        <p>
          Paper airplane{' '}
          <a href="https://www.flaticon.com/free-icons/mail" title="mail icons">
            Mail icons created by Freepik - Flaticon
          </a>
        </p>
      </div>
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
        destination: `https://${context.req.headers.host}/`,
        permanent: true,
      },
    };
  }

  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;
  if (token) {
    const session = await getSessionByToken(token);
    if (session) {
      const currentUser = await getFullUserByToken(token);
      return {
        props: {
          currentUser,
        },
      };
    }
  }
  return { props: {} };
}
