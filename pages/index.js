import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSessionByToken } from '../util/database';

const noMargin = css`
  margin-bottom: -6vw;
`;

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
    position: absolute;
    top: 0;
    left: 0;
    border-bottom: 6px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(
      to right,
      #05396b,
      #389583,
      #8de4af,
      #bff0d1
    );
    @media screen and (min-width: 600px) {
      opacity: 0;
      height: 0;
    }
  }
  .bgPhotoM {
    opacity: 0.6;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-bottom: 6px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(
      to right,
      #05396b,
      #389583,
      #8de4af,
      #bff0d1
    );
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
    position: absolute;
    top: 0;
    left: 0;
    border-bottom: 6px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(
      to right,
      #05396b,
      #389583,
      #8de4af,
      #bff0d1
    );
    @media screen and (max-width: 1100px) {
      opacity: 0;
      height: 0;
    }
  }

  .text {
    width: 100vw;
    position: relative;
    align-items: center;
    gap: 250px;

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
      margin-bottom: 80px;

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

const divide = css`
  height: 150px;
  padding: 50px;
  text-align: center;
`;

const sectionTwo = css`
  width: 100vw;
  max-height: fit-content;
  display: grid;
  place-items: center;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  border-top: 6px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    to right,
    #05396b,
    #389583,
    #8de4af,
    #bff0d1
  );
  img {
    width: 100%;
    opacity: 0.7;
    grid-row: 1 / span 3;
    grid-column: 1 / span 3;
  }
  .imgS {
    @media screen and (min-width: 600px) {
      opacity: 0;
      height: 0;
    }
  }
  .imgM {
    @media screen and (max-width: 600px) {
      opacity: 0;
      height: 0;
    }
    @media screen and (min-width: 1100px) {
      opacity: 0;
      height: 0;
    }
  }
  .imgL {
    @media screen and (max-width: 1100px) {
      opacity: 0;
      height: 0;
    }
  }
  .buttonStyles {
    text-decoration: none;
    z-index: 2;
    background-color: #ffffff4d;
    width: max-content;
    grid-row: 2 / span 1;
    grid-column: 2 / span 1;
  }
`;

export default function Dashboard() {
  return (
    <div css={noMargin}>
      <Head>
        <title>Buddies - find your people</title>
        <meta
          name="description"
          content="Buddies. The chat app to find your people in Vienna."
        />
      </Head>
      <div css={homeStyles} className="pageWrap">
        <div className="imgWrap">
          <img
            className="bgPhotoS"
            src="/sunsetS.jpg"
            alt="people sitting on a mountain, looking down at a lake in the sunset"
          />
          <img
            className="bgPhotoM"
            src="/sunsetM.jpg"
            alt="people sitting on a mountain, looking down at a lake in the sunset"
          />
          <img
            className="bgPhotoL"
            src="/sunsetL.jpg"
            alt="people sitting on a mountain, looking down at a lake in the sunset"
          />
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
      <div css={divide}>
        <Image src="/paperIcon.png" height="50px" width="50px" alt="" />
      </div>
      <div css={sectionTwo}>
        <img
          className="imgS"
          src="/picknick.jpg"
          alt="background of friends having a picknick"
        />
        <img
          className="imgM"
          src="/picknickM.jpg"
          alt="background of friends having a picknick"
        />
        <img
          className="imgL"
          src="/picknickL.jpg"
          alt="background of friends having a picknick"
        />
        <Link href="/about">
          <a className="buttonStyles">About Buddies</a>
        </Link>
      </div>
    </div>
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
