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
const info = css`
  position: relative;
  margin-bottom: 25px;
  padding: 30px 0 20px 0;
  text-align: justify;
  border-top: solid;
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
  p {
    line-height: 1.3;
    margin: 0;
    font-size: 10px;
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
              <a className="buttonStyles">Sign up</a>
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
      <div css={info}>
        <h2 className="h1Font">About Buddies</h2>
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

// TODOS

// X match users
// X context
// X authentication
// X Chat
// X add avatar to update page
// X use radio buttons to choose avatar
// X limit the amount of people in a chat
// X add their names to their messages
// X leave a chat
// X ask if they are sure they want to leave the chat
// X display the chats a user is in on their dashboard/profile
// X remove Header from landing page
// X clean up duplicate files/ organize profile
// X search for a logo
// X menu styles
// X error handling: display only custom messages, not full error message
// X check if the chat authorization works
// X make the chat creator the admin
// X admin can't leave the chat
// X admin can delete a chat and its chatHistory
// X use the logo in some places, maybe when 'loading...'
// O invite people into the existing chat
// O redirect from landing page, if logged in
// O add <Head> to every page
// X add a favicon
