import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const homeStyles = css`
  .pageWrap {
    overflow: hidden;
    position: relative;
  }

  .bgPhoto {
    opacity: 0.6;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
  }

  .text {
    position: relative;
    align-items: center;
    .top {
      align-items: center;
      margin-top: 6vh;
      margin-bottom: 28vh;
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
      h2 {
        margin: 0;
      }
      p {
        margin: 0;
      }
      .buttonStyles {
        text-decoration: none;
        color: inherit;
        margin: 3vh;
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
        <img className="bgPhoto" src="/picknickMobile.jpg" alt="" />
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
    </>
  );
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
// O error handling: display only custom messages, not full error message
// O add <Head> to every page
// O check if the chat authorization works
// O invite people into the existing chat
// O make the chat creator the admin
// O admin can't leave the chat
// O admin can delete a chat and its chatHistory
// O redirect from landing page, if logged in
// O use the logo in some places, maybe when 'loading...'

// colors:
//  #376e6f
//  #97caef

// #116466
// #7caaab

//  #44318d
//  #8265a7
// #99728d
