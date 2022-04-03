import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import {
  getActivitiesByUserId,
  getChatMembersByChatId,
  getChatsByUserId,
  getFullUserByToken,
  getUserById,
} from '../../util/database';
import matchUsers from '../../util/match';
import { ChatMember, Chats, UserActivity, UserInfo } from '../../util/types';

const avatar = css`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  outline: 6px solid #05396b;
  overflow: hidden;
  margin: 10px;
  text-align: center;
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
  h2 {
    margin: 25px;
  }
`;

type Props = {
  userInfo: UserInfo;
  userActivities: UserActivity[];
  currentUser: UserInfo;
  chats?: FullChat[];
};

type FullChat = {
  id: number;
  name: string;
  buddies: ChatMember[];
};

export default function User(props: Props) {
  return (
    <>
      <Head>
        <title>Buddies Dashboard</title>
        <meta
          name="description"
          content="Buddies. The chat app to find your people in Vienna."
        />
      </Head>
      <div className="responsive flexColumn">
        <Header user={props.currentUser} />
        <h1 className="h1Font">
          {props.chats
            ? `Welcome back, ${props.userInfo.name} `
            : `${props.userInfo.name} `}
          <Image
            src="/paperIcon.png"
            width="40px"
            height="40px"
            alt="the buddies logo: a paper airplane"
          />
        </h1>
        <div css={avatar}>
          {props.userInfo.avatar.length > 10 ? (
            <img
              width="100px"
              height="100px"
              src={props.userInfo.avatar}
              alt="gravatar profile"
            />
          ) : (
            <Image
              width="100px"
              height="100px"
              src={props.userInfo.avatar}
              alt={`user avatar of a ${props.userInfo.avatar.slice(1, -4)}`}
            />
          )}
        </div>
        <p>
          {props.userInfo.bio}{' '}
          {props.chats && (
            // <span>
            <Link href="/profile">
              <a data-test-id="edit">
                {' '}
                <Image
                  src="/editIcon.png"
                  alt=""
                  aria-label="edit my profile"
                  width="14px"
                  height="14px"
                />
              </a>
            </Link>
            // </span>
          )}
        </p>
        <p css={activity}>
          {props.userActivities.map((a) => {
            return (
              <span className="activity" key={`user-activities-${a.id}`}>
                {a.title}
              </span>
            );
          })}
        </p>
        {props.chats && (
          <div css={openChats}>
            <h2 className="h1Font">Current Chats</h2>
            {props.chats.length === 0 && (
              <p>
                You are not currently in any chats.
                <br />
                <Link href="/matches">
                  <a data-test-id="matches">➞ Go to your matches</a>
                </Link>{' '}
              </p>
            )}
            {/* list all the chats they are a part of by chat name and list the names of all chat members*/}
            {props.chats.map((chat) => {
              return (
                <div key={`user-${props.userInfo.id}-userChats-${chat.id}`}>
                  <p>
                    <Link href={`/chats/${chat.id}`}>
                      <a>{chat.name}</a>
                    </Link>{' '}
                    with{' '}
                    {chat.buddies.map((buddy) => {
                      if (buddy.id !== props.userInfo.id) {
                        return (
                          <span
                            key={`${props.userInfo.id}-${chat.id}-${buddy.id}`}
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
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // check if there is already a valid token in the cookie
  const token = context.req.cookies.sessionToken;
  // get the user by token
  const currentUser: UserInfo | undefined = await getFullUserByToken(token);
  if (currentUser) {
    // if they are logged in but viewing SOMEONE ELSE'S PAGE
    if (Number(currentUser.id) !== Number(context.query.userId)) {
      // check if they are matched -if not, redirect
      // not done: check if they are in a chat together
      const matchIds = await matchUsers(currentUser.id);
      if (
        !matchIds.some(
          (matchId) => Number(matchId) === Number(context.query.userId),
        )
      ) {
        return {
          redirect: {
            destination: `/users/${currentUser.id}`,
            permanent: false,
          },
        };
      }
      // if they are matched, get the user info
      const userInfo: UserInfo = await getUserById(context.query.userId);
      const userActivities: UserActivity[] = await getActivitiesByUserId(
        context.query.userId,
      );
      // if they look at their match's page, no chat props is passed
      return {
        props: { userInfo, userActivities, currentUser },
      };
    }

    // if this is their OWN PAGE
    const userActivities: UserActivity[] = await getActivitiesByUserId(
      currentUser.id,
    );

    // also get the chats they are in
    const chats: Chats = await getChatsByUserId(currentUser.id);

    // and the users who are in those chats with them
    let fullChatInfo: FullChat[] | [] = [];
    for (const chat of chats) {
      const buddies: ChatMember[] = await getChatMembersByChatId(chat.id);
      fullChatInfo = [...fullChatInfo, { ...chat, buddies }];
    }
    return {
      props: {
        userInfo: currentUser,
        userActivities,
        currentUser,
        chats: fullChatInfo,
      },
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
