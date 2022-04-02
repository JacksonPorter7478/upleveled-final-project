import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../components/Header';
import {
  getActivitiesByUserId,
  getFullUserByToken,
  getUserById,
} from '../util/database';
import matchUsers from '../util/match';
import { chatUserMutation, createChatMutation } from './api/client';

const userStyles = (opacity: number, checked: number) => css`
  width: 100%;
  @media screen and (min-width: 900px) {
    width: 60%;
    margin-top: 30px;
  }
  border: 2px solid #ebebeb;
  border-radius: 6px;
  padding: 0 20px 20px;
  margin-bottom: 25px;
  line-height: 1.3;
  opacity: ${opacity};
  opacity: ${checked};

  .invisible {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }
  .visible {
    opacity: 0;
    :focus + div {
      padding: 15px;
      border: 1px solid #ebebeb;
      border-radius: 4px;
    }
  }
  .name {
    display: flex;
    justify-content: space-between;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      outline: 6px solid #05396b;
      overflow: hidden;
      margin-bottom: 16px;
    }
  }
  .bio {
    font-size: 20px;
    margin: 10px 0;
  }
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

const startChatDiv = css`
  width: 100%;

  @media screen and (min-width: 900px) {
    width: 60%;
    margin-top: 30px;
  }
  .invisible {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }
  .visible {
    justify-content: center;
    align-items: center;
  }
  button {
    padding: 0 4px;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
`;

const openChatStyles = css`
  margin: 30px 0 60px 0;
  letter-spacing: 2px;
`;

type User = { id: number; name: string; bio: string; avatar: string };
type UserActivities = { id: number; title: string };
type MatchesList = { matchInfo: User; matchActivities: UserActivities[] };
type Props = {
  currentUser: User;
  matchesList: MatchesList[];
};

export default function Matches(props: Props) {
  // custom error message
  const [errorInfo, setErrorInfo] = useState('');
  const [chatName, setChatName] = useState('');
  const [chatMembers, setChatMembers] = useState<
    { userId: number; name: string }[] | []
  >([]);
  const [chatOptionsVisible, setChatOptionsVisible] = useState('invisible');
  const router = useRouter();
  // MUTATIONS
  const [openChat] = useMutation(createChatMutation);
  const [addMember] = useMutation(chatUserMutation);

  async function openNewChat() {
    // make sure the chat is given a name and at least one user is selected
    if (!chatName) {
      return setErrorInfo('Please give your new chat a name');
    }
    if (chatMembers.length === 0 || chatMembers.length > 5) {
      return setErrorInfo(
        'Please select between one and five buddies to chat with',
      );
    }
    // create a new chat
    const chat = await openChat({ variables: { name: chatName } });
    // add the selected users to the chat
    for (const member of chatMembers) {
      await addMember({
        variables: {
          userId: member.userId,
          chatId: chat.data.createNewChat.id,
        },
      });
    }
    // redirect to chat
    await router.push(`/chats/${chat.data.createNewChat.id}`);
  }

  return (
    <>
      <Head>
        <title>Buddies - your matches</title>
        <meta
          name="description"
          content="All your matches at one glance. Start a group chat and plan your next adventure."
        />
      </Head>
      <Header user={props.currentUser} />
      <h1 className="h1Font">
        Matches{' '}
        <Image
          src="/paperIcon.png"
          width="40px"
          height="40px"
          alt="the buddies logo: a paper airplane"
        />
      </h1>
      {props.matchesList.length === 0 ? (
        "You don't have any matches yet. Tell more people about this app, and maybe try selecting more activities in your profile!"
      ) : (
        // onClick the button shows(or hides) a chatName input field and all users are given some transparency (until they are selected)
        <button
          data-test-id="chatOptions"
          css={openChatStyles}
          className="buttonStyles"
          onClick={() => {
            setChatOptionsVisible(
              chatOptionsVisible === 'visible' ? 'invisible' : 'visible',
            );
            // clear the error info
            setErrorInfo('');
          }}
        >
          {chatOptionsVisible === 'invisible'
            ? 'Start a new group'
            : 'Hide chat options'}
        </button>
      )}
      <div css={startChatDiv}>
        <div className={`${chatOptionsVisible} flexColumn`}>
          {/* error if no chatName given */}
          {errorInfo && <p>{errorInfo}</p>}
          <label>
            1. Give your chat a name:
            <br />
            <input
              data-test-id="chatName"
              value={chatName}
              onChange={(event) => setChatName(event.currentTarget.value)}
              max-length="50"
            />
          </label>
          <p>
            2. Select up to 5 people for this chat:
            <br />
            {/* list users selected for the new chat */}
            {chatMembers.map((member) => {
              return (
                <span key={`invite-${member.userId}-to-chat`}>
                  {' '}
                  {member.name}
                </span>
              );
            })}
          </p>
          {/* the openChat button shows up when at least one user is selected */}
          {chatMembers.length > 0 && (
            <button
              onClick={() => openNewChat()}
              className="buttonStyles"
              data-test-id="createChat"
            >
              Open chat
            </button>
          )}
        </div>
      </div>
      {/* list all matches */}
      {props.matchesList.map((m) => {
        return (
          <label
            key={`dashboard-users-${m.matchInfo.id}`}
            // parameter 1: are all matches partly transparent or opaque?
            // parameter 2: when all matches are partly transparent: matches that are selected for the chat should switch back to opaque
            css={userStyles(
              chatOptionsVisible === 'invisible' ? 1 : 0.5,
              chatOptionsVisible === 'invisible'
                ? 1
                : chatMembers.some((item) => item.userId === m.matchInfo.id)
                ? 1
                : 0.5,
            )}
          >
            <div>
              {/* when chatOptions are visible, make each match selectable (add to chatMembers) and change the css */}
              <input
                data-test-id={`chat-with-${m.matchInfo.name}`}
                className={chatOptionsVisible}
                type="checkbox"
                disabled={chatOptionsVisible === 'invisible'}
                checked={chatMembers.some(
                  (item) => item.userId === m.matchInfo.id,
                )}
                onChange={(event) => {
                  setChatMembers(
                    event.currentTarget.checked
                      ? [
                          ...chatMembers,
                          { userId: m.matchInfo.id, name: m.matchInfo.name },
                        ]
                      : chatMembers.filter(
                          (member) => member.userId !== m.matchInfo.id,
                        ),
                  );
                }}
              />
              {/* list match name, avatar, bio, activities */}
              <div>
                <div className="name">
                  <h2>{m.matchInfo.name}</h2>
                  <div className="avatar">
                    {m.matchInfo.avatar.length > 10 ? (
                      <img
                        width="80px"
                        height="80px"
                        src={m.matchInfo.avatar}
                        alt="gravatar profile"
                      />
                    ) : (
                      <Image
                        width="80px"
                        height="80px"
                        src={m.matchInfo.avatar}
                        alt={`user avatar of a ${m.matchInfo.avatar.slice(
                          1,
                          -4,
                        )}`}
                      />
                    )}
                    {/* <Image
                      width="80px"
                      height="80px"
                      src={m.matchInfo.avatar}
                      alt={
                        m.matchInfo.avatar.length > 10
                          ? 'gravatar profile picture'
                          : `user avatar of a ${m.matchInfo.avatar.slice(
                              1,
                              -4,
                            )}`
                      }
                    /> */}
                  </div>
                </div>
                <p className="bio">{m.matchInfo.bio}</p>
                {m.matchActivities.map((activity) => {
                  return (
                    <span
                      className="activity"
                      key={`dashboard-${m.matchInfo.id}-activity-${activity.id}`}
                    >
                      {activity.title}
                    </span>
                  );
                })}
              </div>
            </div>
          </label>
        );
      })}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // check if there is already a valid token in the cookie and get the corresponding user
  const token = context.req.cookies.sessionToken;
  const currentUser = await getFullUserByToken(token);

  // if there is a user, get their matches
  if (currentUser) {
    const matches = await matchUsers(currentUser.id);

    // for each match, i want an object in the array: { matchInfo: {id: , name: , bio: , avatar: }, matchActivities: [title: ] }
    let matchesList: MatchesList[] | [] = [];

    for (const match of matches) {
      const matchInfo: User = await getUserById(match);
      const matchActivities: UserActivities[] = await getActivitiesByUserId(
        match,
      );

      matchesList = [...matchesList, { matchInfo, matchActivities }];
    }

    return {
      props: {
        currentUser,
        matchesList,
      },
    };
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
