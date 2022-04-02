import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../../components/Header';
import {
  getChatById,
  getChatMembersByChatId,
  getFullUserByToken,
  getMessagesByChatId,
  getUserById,
} from '../../util/database';
import matchUsers from '../../util/match';
import { Chat, ChatMember, Message, UserInfo } from '../../util/types';
import {
  chatUserDeleteMutation,
  chatUserMutation,
  deleteChatMutation,
} from '../api/client';

// this chat component isn't suitable for Server Side Rendering. By default, Next.js attempts to render everything on the server side
// by using a dynamic() call, we can tell Next.js not to render this during the build process,
// where it would throw errors because it can't connect to the APIs that it needs to function.
// https://ably.com/blog/realtime-chat-app-nextjs-vercel
const AblyChatComponent = dynamic(
  () => import('../../components/AblyChatComponent'),
  { ssr: false },
);

const members = css`
  width: 100%;
  margin-bottom: 10px;
  .buddies {
    display: inline-flex;
    align-items: center;
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin: 10px;
  }
  .addMember {
    background-color: transparent;
    border-radius: 4px;
    margin-left: 5px;
    :hover,
    :focus {
      border: 3px solid #389583;
    }
  }
`;

const top = css`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  a {
    text-decoration: none;
    color: black;
  }
  button {
    background-color: transparent;
    border: none;
    text-decoration: underline;
    border-radius: 4px;
    margin-top: 15px;
  }
  .popup {
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .popup.open {
    z-index: 1;
    width: 75vw;
    max-width: 400px;
    height: min-content;
    padding: 20px;
    position: absolute;
    top: 20vh;
    left: 6.5vw;
    background-color: #ebebeb;
    border: 2px solid #05396b;
    border-radius: 4px;
    font-size: 24px;
    div {
      margin-top: 15px;
      display: flex;
      justify-content: center;
      gap: 30px;
      button {
        font-size: inherit;
        text-decoration: none;
        border: 2px solid #05396b;
      }
    }
  }
`;
const h1 = css`
  margin: 30px 0;
`;

type Props = {
  currentUser: UserInfo;
  matches: UserInfo[];
  chat: Chat;
  chatMembers: ChatMember[];
  chatHistory: Message[];
};

export default function TestChat(props: Props) {
  const [newMemberId, setNewMemberId] = useState<number>();
  const [chatMembers, setChatMembers] = useState(props.chatMembers);
  // this is asks 'are you sure you want to delete/leave the chat?'
  const [popup, setPopup] = useState('closed');
  // custom error message
  const [errorInfo, setErrorInfo] = useState('');
  const router = useRouter();
  // MUTATIONS
  const [deleteUserFromChat] = useMutation(chatUserDeleteMutation);
  const [deleteChatFromDb] = useMutation(deleteChatMutation);
  const [addMember] = useMutation(chatUserMutation);

  // the current user can add someone to the chat, if they are the chat admin
  // and if there are fewer than 5 people in the chat with them
  // otherwise this section won't show
  const displayAddToChat =
    chatMembers.length < 5 && props.chat.userId === props.currentUser.id;

  async function leaveChat() {
    // delete the current user from the chat_users table, so they are no longer part of this chat, then redirect
    try {
      await deleteUserFromChat({
        variables: { userId: props.currentUser.id, chatId: props.chat.id },
      });
      await router.push(`/matches`);
    } catch (err) {
      setErrorInfo('Oh no! There has been an issue. Please try again later.');
    }
  }

  async function deleteChat() {
    // delete the entire chat and all its messages from the database, then redirect
    try {
      await deleteChatFromDb({
        variables: {
          chatId: props.chat.id,
        },
      });
      await router.push(`/matches`);
    } catch (err) {
      setErrorInfo('Oh no! There has been an issue. Please try again later.');
    }
  }

  async function addNewChatMember() {
    try {
      await addMember({
        variables: {
          userId: newMemberId,
          chatId: props.chat.id,
        },
      });
      const member = props.matches.find(
        (match) => Number(match.id) === Number(newMemberId),
      );
      if (!member) {
        return;
      }
      setChatMembers([...chatMembers, member]);
    } catch (err) {
      setErrorInfo('Oh no! There has been an issue. Please try again later.');
    }
  }

  return (
    <>
      <Head>
        <title>{props.chat.name}</title>
        <meta
          name="description"
          content="Buddies. The chat app to find your people in Vienna."
        />
      </Head>
      <div className="responsive">
        <Header user={props.currentUser} />
        {errorInfo && <p>{errorInfo}</p>}
        {/* if the current user is the one who created the chat, they can delete it, otherwise only leave it */}
        {props.currentUser.id === props.chat.userId ? (
          <div css={top}>
            <div className={`popup ${popup}`}>
              Are you sure you want to permanently delete this chat and all the
              messages in it?
              <div>
                <button onClick={() => deleteChat()}>Delete</button>
                <button onClick={() => setPopup('closed')}>Cancel</button>
              </div>
            </div>
            <button onClick={() => setPopup('open')}>Delete this chat</button>
          </div>
        ) : (
          <div css={top}>
            <div className={`popup ${popup}`}>
              Are you sure you want to leave this chat?
              <div>
                <button onClick={() => leaveChat()}>Leave</button>
                <button onClick={() => setPopup('closed')}>Cancel</button>
              </div>
            </div>
            <button onClick={() => setPopup('open')}>
              Want to leave this chat?
            </button>
          </div>
        )}
        <h1 className="h1Font" css={h1}>
          {props.chat.name}{' '}
          <Image
            src="/paperIcon.png"
            width="40px"
            height="40px"
            alt="the buddies logo: a paper airplane"
          />
        </h1>
        {/* list the people in this chat with the current user */}
        <div css={members}>
          Buddies in this chat:
          <br />
          {chatMembers.map((member) => {
            return (
              <div
                key={`chat-${props.chat.id}-user-${member.id}`}
                className="buddies"
              >
                <div className="avatar">
                  {member.avatar.length > 10 ? (
                    <img
                      width="30px"
                      height="30px"
                      src={member.avatar}
                      alt="gravatar profile"
                    />
                  ) : (
                    <Image
                      width="30px"
                      height="30px"
                      src={member.avatar}
                      alt={`user avatar of a ${member.avatar.slice(1, -4)}`}
                    />
                  )}
                </div>
                <span>{member.name}</span>
              </div>
            );
          })}
          <br />
          {displayAddToChat && (
            <form>
              Invite someone else into the chat:{' '}
              <select
                onChange={(event) =>
                  setNewMemberId(Number(event.currentTarget.value))
                }
              >
                <option>----</option>
                {/* filter out the people who are already in the chat, return all other matches as an option */}
                {props.matches
                  .filter(
                    (match) =>
                      !chatMembers.find((member) => member.id === match.id),
                  )
                  .map((match) => {
                    return (
                      <option
                        key={`invite-${match.id}-to-${props.chat.id}`}
                        value={match.id}
                      >
                        {match.name}
                      </option>
                    );
                  })}
              </select>
              <button
                className="addMember"
                onClick={(event) => {
                  event.preventDefault();
                  addNewChatMember().catch(() =>
                    setErrorInfo(
                      'Oh no! There has been an issue. Please try again later.',
                    ),
                  );
                }}
              >
                Add
              </button>
            </form>
          )}
        </div>

        {/* this is the actual chat component, pass the chatId, all its messages and current user to it */}
        <AblyChatComponent
          chatId={props.chat.id}
          chatHistory={props.chatHistory}
          user={props.currentUser}
        />
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
    // get the chat via the id from the url
    const chat: Chat | undefined = await getChatById(context.query.chatId);
    if (!chat) {
      return {
        redirect: {
          destination: '/matches',
          permanent: false,
        },
      };
    }
    // get all chat members
    const chatMembers: ChatMember[] = await getChatMembersByChatId(chat.id);
    // if the current user isn't in this chat, send them to another page
    if (!chatMembers.some((member) => member.id === currentUser.id)) {
      return {
        redirect: {
          destination: '/matches',
          permanent: false,
        },
      };
    }

    // get all chat messages
    const chatHistory: Message[] = await getMessagesByChatId(chat.id);
    // get the current user's matches
    const matchIds = await matchUsers(currentUser.id);
    let matches: UserInfo[] | [] = [];
    for (const matchId of matchIds) {
      const match: UserInfo = await getUserById(matchId);
      matches = [...matches, match];
    }
    // if there is a logged in user who is part of this chat
    return {
      props: {
        currentUser,
        matches,
        chat,
        chatMembers: chatMembers.filter(
          (member) => member.id !== currentUser.id,
        ),
        chatHistory,
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
