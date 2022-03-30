import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSessionByToken } from '../util/database';

const homeStyles = css`
  .pageWrap {
    overflow: hidden;
    position: relative;
  }
  .imgWrap {
    height: 900px;
    width: 100vw;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
  }
  .bgPhotoS {
    opacity: 0.6;
    height: 100%;
    @media screen and (min-width: 600px) {
      opacity: 0;
      height: 0;
    }
  }
  .bgPhotoM {
    opacity: 0.6;
    height: 100%;
    @media screen and (max-width: 600px) {
      opacity: 0;
      height: 0;
    }
    @media screen and (min-width: 1100px) {
      opacity: 0;
      height: 0;
    }
  }
  .bgPhotoL {
    opacity: 0.6;
    height: 100%;
    @media screen and (max-width: 1100px) {
      opacity: 0;
      height: 0;
    }
  }

  .text {
    width: 100vw;
    position: relative;
    align-items: center;
    gap: 290px;
    .top {
      align-items: center;
      margin-top: 100px;
      h1 {
        font-size: 60px;
        margin: 0;
        color: black;
      }
    }
    .bottom {
      align-items: center;
      background-color: #ffffff4d;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 60px;
      h2,
      p {
        margin: 0;
      }
      .buttonStyles {
        text-decoration: none;
        color: inherit;
        margin: 25px;
      }
    }
  }
`;

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Buddies - find your people</title>
        <meta
          name="description"
          content="Buddies. The chat app to find your people in Vienna."
        />
      </Head>
      <div css={homeStyles} className="pageWrap">
        <div className="imgWrap">
          <img className="bgPhotoS" src="/picknick.jpg" alt="" />
          <img className="bgPhotoM" src="/picknickM.jpg" alt="" />
          <img className="bgPhotoL" src="/picknickL.jpg" alt="" />
        </div>
        <div className="text flexColumn">
          <div className="top flexColumn">
            <Image
              src="/paperIcon.png"
              width="130px"
              height="130px"
              alt="the buddies logo: a paper airplane"
            />
            <h1 className="h1Font">Buddies</h1>
          </div>
          <div className="bottom flexColumn">
            <h2 className="h1Font"> Find your people</h2>
            <Link href="/register">
              <a className="buttonStyles" data-test-id="register">
                Sign up
              </a>
            </Link>
            <p>
              You already have an account?{' '}
              <Link href="/login">
                <a>Sign in</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Link href="/about">
        <a>About Buddies</a>
      </Link>
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
  return { props: {} };
}
