import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { createMsgMutation } from '../pages/api/client';
import { useChannel } from './AblyReactEffect';

const chatHolder = css`
  display: grid;
  grid-template-rows: 1fr 70px;
  border: 2px solid #05396b;
  border-radius: 4px;
  height: 90vh;
  @media screen and (min-width: 600px) {
    height: 70vh;
  }
  .chatText {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1em;
    overflow-y: auto;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr 100px;
    border-top: 1px solid #05396b;
  }

  .textarea {
    padding: 0.6em;
    border: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 1.2em;
  }

  .button {
    border: none;
    color: white;
    font-weight: bold;
    letter-spacing: 4px;
    font-size: 1.4em;
    background: #05396b;

    :focus {
      border: 4px solid #bff0d1;
    }

    :hover {
      background: #389583;
    }

    :disabled,
    :hover:disabled {
      background: #8de4af;
      opacity: 40%;
    }
  }

  .message {
    font-size: 18px;
    background-color: #bff0d1;
    padding: 0.7em;
    margin-right: 20px;
    line-height: 1.5;
    border-radius: 10px;
    flex-grow: 0;
    border-bottom-left-radius: 0;
    strong {
      display: block;
    }
  }

  p[data-author='me'] {
    background-color: #389583;
    color: white;
    margin-left: 20px;
    margin-right: 0;
    -webkit-align-self: flex-end;
    -ms-flex-item-align: end;
    align-self: flex-end;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 10px;
  }
`;

export default function AblyChatComponent(props) {
  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setReceivedMessages] = useState(props.chatHistory);
  const inputFocus = useRef(null);
  const [saveMessage] = useMutation(createMsgMutation);

  const messageTextIsEmpty = messageText.trim().length === 0;
  let messageEnd = null;

  const [channel, ably] = useChannel('chat-demo', (message) => {
    // Here we're computing the state that'll be drawn into the message history
    // We do that by slicing the last 199 messages from the receivedMessages buffer

    const history = receivedMessages.slice(-199);
    setReceivedMessages([...history, message]);

    // Then finally, we take the message history, and combine it with the new message
    // This means we'll always have up to 199 message + 1 new message, stored using the
    // setMessages react useState hook
  });

  async function sendChatMessage() {
    // publish the message, add user's name in the name payload
    channel.publish({
      name: props.user.name,
      data: messageText,
    });

    // i want to also save the message in the database
    try {
      await saveMessage({
        variables: {
          chatId: props.chatId,
          content: messageText,
          name: props.user.name,
        },
      });
    } catch (err) {
      console.log(err);
    }

    setMessageText('');
    inputFocus.current.focus();
  }

  async function handleFormSubmission(event) {
    event.preventDefault();
    await sendChatMessage();
  }

  async function handleKeyPress(event) {
    if (event.charCode !== 13 || messageTextIsEmpty) {
      return;
    }
    event.preventDefault();
    await sendChatMessage();
  }

  const messages = receivedMessages.map((message) => {
    const sender = message.name;
    const author = message.name === props.user.name ? 'me' : message.name;

    return (
      <p
        key={`author-${author}-${message.timestamp}`}
        className="message"
        data-author={author}
      >
        {sender !== props.user.name && <strong>{sender}</strong>}
        {message.data && message.data}
        {message.content && message.content}
      </p>
    );
  });

  // scroll the message history to the bottom whenever the component renders
  useEffect(() => {
    messageEnd.scrollIntoView({ behavior: 'smooth' });
  }, [receivedMessages]);

  return (
    <div css={chatHolder}>
      <div className="chatText">
        {messages}
        {/* empty div to control scroll to bottom: */}
        <div
          ref={(element) => {
            messageEnd = element;
          }}
        />
      </div>
      <form onSubmit={handleFormSubmission} className="form">
        <textarea
          ref={inputFocus}
          value={messageText}
          placeholder="Type a message..."
          onChange={(event) => setMessageText(event.target.value)}
          onKeyPress={(event) => handleKeyPress(event)}
          className="textarea"
          maxLength="600"
        />
        <button className="button" disabled={messageTextIsEmpty}>
          Send
        </button>
      </form>
    </div>
  );
}
