import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
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

const userStyles = (grayScale: number, checked: number) => css`
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
  opacity: ${grayScale};
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
      img {
        width: 100%;
        height: 100%;
      }
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
  padding: 0 6px;
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
  const [error, setError] = useState('');
  const [chatName, setChatName] = useState('');
  const [chatMembers, setChatMembers] = useState<
    { userId: number; name: string }[] | []
  >([]);
  const [checked, setChecked] = useState<{ id: number }[] | []>([]);
  const [divVisibility, setDivVisibility] = useState('invisible');
  const [openChat] = useMutation(createChatMutation);
  const [addMember] = useMutation(chatUserMutation);
  const router = useRouter();

  async function openNewChat() {
    if (!chatName) {
      return setError('Please give your new chat a name');
    }
    if (chatMembers.length === 0 || chatMembers.length > 5) {
      return setError(
        'Please select between one and five buddies to chat with',
      );
    }
    setError('');
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
    router
      .push(`/chats/${chat.data.createNewChat.id}`)
      .catch((err) => console.log(err));
  }

  return (
    <>
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
      <button
        css={openChatStyles}
        className="buttonStyles"
        onClick={() => {
          setDivVisibility(
            divVisibility === 'visible' ? 'invisible' : 'visible',
          );
        }}
      >
        {divVisibility === 'invisible'
          ? 'Start a new group'
          : 'Hide chat options'}
      </button>
      <div css={startChatDiv}>
        <div className={`${divVisibility} flexColumn`}>
          {error && <p>{error}</p>}
          <label>
            1. Give your chat a name:
            <br />
            <input
              value={chatName}
              onChange={(event) => setChatName(event.currentTarget.value)}
              max-length="50"
            />
          </label>
          <p>
            2. Select up to 5 people for this chat:
            <br />
            {chatMembers.map((member) => {
              return (
                <span key={`invite-${member.userId}-to-chat`}>
                  {' '}
                  {member.name}
                </span>
              );
            })}
          </p>
          {chatMembers.length > 0 && (
            <button onClick={() => openNewChat()} className="buttonStyles">
              Open chat
            </button>
          )}
        </div>
      </div>
      {props.matchesList.map((m) => {
        return (
          <label
            key={`dashboard-users-${m.matchInfo.id}`}
            css={userStyles(
              divVisibility === 'invisible' ? 1 : 0.5,
              divVisibility === 'invisible'
                ? 1
                : checked.some((item) => item.id === m.matchInfo.id)
                ? 1
                : 0.5,
            )}
          >
            <div>
              <input
                className={divVisibility}
                type="checkbox"
                disabled={divVisibility === 'invisible'}
                checked={checked.some((item) => item.id === m.matchInfo.id)}
                onChange={(event) => {
                  setChecked(
                    event.currentTarget.checked
                      ? [...checked, { id: m.matchInfo.id }]
                      : checked.filter((item) => {
                          return item.id !== m.matchInfo.id;
                        }),
                  );
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
              <div>
                <div className="name">
                  <h2>{m.matchInfo.name}</h2>
                  <div className="avatar">
                    <img
                      src={m.matchInfo.avatar}
                      alt={
                        m.matchInfo.avatar.length > 10
                          ? 'gravatar profile picture'
                          : `user avatar of a ${m.matchInfo.avatar.slice(
                              1,
                              -4,
                            )}`
                      }
                    />
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

    // for each match, i want an object in the array: { matchInfo: {id: , name: , bio: }, matchActivities: [title: ]}
    let matchesList: MatchesList[] | [] = [];

    for (const match of matches) {
      const matchInfo: User = await getUserById(match);
      const matchActivities: UserActivities[] = await getActivitiesByUserId(
        match,
      );

      const matchingUser = { matchInfo, matchActivities };

      matchesList = [...matchesList, matchingUser];
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
