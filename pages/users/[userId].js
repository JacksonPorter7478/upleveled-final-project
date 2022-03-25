import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import {
  getActivitiesByUserId,
  getChatMembersByChatId,
  getChatsByUserId,
  getFullUserByToken,
} from '../../util/database';

const avatar = css`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  outline: 6px solid #05396b;
  overflow: hidden;
  margin: 10px;
  img {
    height: 100%;
    width: 100%;
  }
`;

const activity = css`
  line-height: 1.3;
  .activity {
    display: inline-block;
    position: relative;
    background-color: #bff0d1;
    margin: 2px 8px;
    padding: 0 2px;
    font-size: 14px;

    ::before {
      z-index: -1;
      position: absolute;
      content: '';
      left: -5%;
      top: 0;
      height: 100%;
      width: 100%;
      transform: skewX(-30deg);
      background-color: inherit;
    }
    ::after {
      z-index: -1;
      position: absolute;
      content: '';
      right: -5%;
      top: 0;
      height: 100%;
      width: 100%;
      transform: skewX(-30deg);
      background-color: inherit;
    }
  }
`;

const openChats = css`
  width: 100%;
`;

export default function User(props) {
  return (
    <>
      <Header user={props.currentUser} />
      <h1 className="h1Font">Hi, {props.currentUser.name}</h1>
      <div css={avatar}>
        <img
          src={props.currentUser.avatar}
          alt={`user avatar of a ${props.currentUser.avatar.slice(1, -4)}`}
        />
      </div>
      <p>
        {props.currentUser.bio}{' '}
        <span>
          {' '}
          <Link href="/profile">
            <a>
              <Image
                src="/editIcon.png"
                alt=""
                aria-label="edit my profile"
                width="14px"
                height="14px"
              />
            </a>
          </Link>
        </span>
      </p>
      <p css={activity}>
        {props.activities.map((a) => {
          return (
            <span className="activity" key={`user-activities-${a.id}`}>
              {a.title}
            </span>
          );
        })}
      </p>

      <div css={openChats}>
        <h2 className="h1Font">Current Chats</h2>
        {props.chats.length === 0 && (
          <Link href="/matches">
            <a>
              You are not currently in any chats. Go to your matches to create a
              new conversation.
            </a>
          </Link>
        )}
        {props.chats.map((chat) => {
          return (
            <div key={`user-${props.currentUser.id}-userChats-${chat.id}`}>
              <p>
                <Link href={`/chats/${chat.id}`}>
                  <a>{chat.name}</a>
                </Link>{' '}
                with{' '}
                {chat.buddies.map((buddy) => {
                  if (buddy.id !== props.currentUser.id) {
                    return (
                      <span
                        key={`${props.currentUser.id}-${chat.id}-${buddy.id}`}
                      >
                        {buddy.name}{' '}
                      </span>
                    );
                  } else {
                    return null;
                  }
                })}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;
  // get the user by token
  const currentUser = await getFullUserByToken(token);
  if (currentUser) {
    if (Number(currentUser.id) !== Number(context.query.userId)) {
      return {
        redirect: {
          destination: `/users/${currentUser.id}`,
          permanent: false,
        },
      };
    }
    // get their activities
    const activities = await getActivitiesByUserId(currentUser.id);

    // get the chats they are in
    const chats = await getChatsByUserId(currentUser.id);

    // and the users who are in those chats with them
    let fullChatInfo = [];
    for (const chat of chats) {
      const buddies = await getChatMembersByChatId(chat.id);
      fullChatInfo = [...fullChatInfo, { ...chat, buddies }];
    }

    return {
      props: { currentUser, activities, chats: fullChatInfo },
    };
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
