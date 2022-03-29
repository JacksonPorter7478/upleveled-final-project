import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import duck from '../public/duck.jpg';
import kitten from '../public/kitten.jpg';
import puppy from '../public/puppy.jpg';
import { createCsrfToken } from '../util/auth';
import { getActivities, getSessionByToken } from '../util/database';
import { addActivity, createMutation } from './api/client';

const md5 = require('md5');

const header = css`
  display: flex;
  width: 100vw;
  margin-top: -6vh;
  padding: 20px;
  justify-content: space-around;
  border-bottom: 3px solid;
  border-image-slice: 1;
  border-width: 4px;
  border-image-source: linear-gradient(
    to right,
    #05396b,
    #389583,
    #8de4af,
    #bff0d1
  );
  a:nth-of-type(2) {
    font-size: 26px;
    text-decoration: none;
  }
`;

const formStyles = css`
  align-items: center;
  h2,
  h3 {
    margin: 16px 0 0 0;
  }
  p {
    margin: 0 0 16px 0;
  }
  textarea {
    display: block;
    width: 80%;
    margin: 4vw;
  }
  input {
    margin-bottom: 15px;
  }
  button {
    margin-top: 20px;
  }
  .avatar {
    display: flex;
    flex-flow: wrap;
    div {
      display: flex;
      flex-flow: wrap;
    }
    label {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      outline: 6px solid #05396b;
      overflow: hidden;
      margin: 15px;
      Image,
      img {
        height: 100%;
      }
    }
    input {
      opacity: 0;
      transform: translate(35px, 20px);
      margin: 0;
      :checked + label {
        outline: 6px solid #8de4af;
      }
      :focus + label {
        outline: 6px solid #bff0d1;
      }
    }
  }
`;

const checkboxStyles = css`
  margin: 36px 0;
  div {
    display: inline-block;
  }
  label {
    display: inline-block;
    padding: 2px 8px;
    margin: 6px;
    border: 2px solid #8de4af;
    border-radius: 4px;
    :hover {
      border: 2px solid #15bab3;
    }
  }
  input {
    opacity: 0;
    transform: translateX(35px);
    margin: 0;
    :checked + label {
      background-color: #bff0d1;
    }
    :focus + label {
      border: 2px solid #05396b;
    }
  }
`;

export default function Registration(props) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [activities, setActivities] = useState([]);
  const [checked, setChecked] = useState(
    props.activities.map((a) => {
      if (activities.includes(a.id)) {
        return { id: a.id, checked: true };
      }
      return { id: a.id, checked: false };
    }),
  );
  const [errorInfo, setErrorInfo] = useState('');
  const router = useRouter();
  const [createNewUser, { loading, error }] = useMutation(createMutation);
  const [addToUser] = useMutation(addActivity);
  const [activityInputError, setActivityInputError] = useState('');

  const gravatar = `https://www.gravatar.com/avatar/${md5(
    email.toLowerCase(),
  )}`;

  async function submitRegistration(event) {
    event.preventDefault();
    // clear the input error and set it only if fewer than 4 activities were chosen
    setActivityInputError('');
    if (activities.length < 4) {
      setActivityInputError('Please choose at least 4 activities');
      return;
    }
    try {
      // create the user
      const user = await createNewUser({
        variables: {
          name: name,
          avatar: avatar,
          bio: bio,
          email: email,
          pw: pw,
          csrfToken: props.csrfToken,
        },
      });
      // if there is an error object, show the custom message
      if (user.data.createUser.error) {
        setErrorInfo(user.data.createUser.error);
        return;
      }
      // send the user's activities to the db
      for (const activity of activities) {
        await addToUser({
          variables: {
            userId: user.data.createUser.id,
            activityId: activity,
          },
        });
      }

      // redirect to their newly created profile
      await router.push(`/users/${user.data.createUser.id}`);
    } catch (err) {
      setErrorInfo(
        'There has been an error creating your profile. Please try again later!',
      );
    }
  }

  if (loading) {
    return (
      <div>
        <Image
          src="/paperIcon.png"
          alt="Loading your profile..."
          width="90vw"
          height="90vw"
        />
        <h1 className="h1Font">Buddies</h1>
      </div>
    );
  }

  return (
    <>
      <header css={header}>
        <Link href="/">
          <a>
            <Image src="/homeIcon.png" width="30px" height="30px" />
          </a>
        </Link>
        <Link href="/login">
          <a>Sign in</a>
        </Link>
      </header>
      <h1 className="h1Font">
        Sign up{' '}
        <Image
          src="/paperIcon.png"
          width="40px"
          height="40px"
          alt="the buddies logo: a paper airplane"
        />
      </h1>
      {error && (
        <h2>
          There has been a problem creating your profile. Please try again
          later!
        </h2>
      )}

      <form
        css={formStyles}
        className="flexColumn responsive"
        onSubmit={submitRegistration}
      >
        <div>
          <label>
            <h2>Name</h2>
            <input
              required
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </label>
          <h2 id="radio">Profile picture</h2>
          <p>
            Please choose an avatar <br />
            (Sign up with your <a href="https://en.gravatar.com/">
              Gravatar
            </a>{' '}
            Email if you prefer using your own picture)
          </p>
          <div className="avatar">
            <div>
              <input
                type="radio"
                name="avatar"
                id="duck"
                onChange={() => {
                  setAvatar('/duck.jpg');
                }}
              />
              <label htmlFor="duck" aria-labelledby="radio">
                <Image src={duck} alt="a baby duck mid-walk" />
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="avatar"
                id="kitten"
                onChange={() => {
                  setAvatar('/kitten.jpg');
                }}
              />
              <label htmlFor="kitten" aria-labelledby="radio">
                <Image
                  src={kitten}
                  alt="super cute kitten looking up at the viewer"
                />
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="avatar"
                id="puppy"
                onChange={() => {
                  setAvatar('/puppy.jpg');
                }}
              />
              <label htmlFor="puppy" aria-labelledby="radio">
                <Image
                  src={puppy}
                  alt="portrait of a puppy with a somewhat mischieveous twinkle in its eye"
                />
              </label>
            </div>
            <div className="gravatar">
              <input
                type="radio"
                name="avatar"
                id="gravatar"
                onChange={() => {
                  setAvatar(gravatar);
                }}
              />
              <label htmlFor="gravatar" aria-labelledby="radio">
                <img src={gravatar} alt="your gravatar profile" />
              </label>
            </div>
          </div>
          <h2>Interests</h2>
          <label>
            Let other people know what kind of activities you're interested in:
            <textarea
              required
              placeholder="e.g. Looking for some gym buddies"
              minLength="50"
              maxLength="300"
              value={bio}
              onChange={(event) => setBio(event.currentTarget.value)}
            />
          </label>
          <div css={checkboxStyles}>
            <h3>Your Categories</h3>
            <p>Please choose at least 4</p>
            {props.activities.map((a) => {
              return (
                <div key={`register-activity-${a.id}`}>
                  <input
                    type="checkbox"
                    id={a.title}
                    checked={checked.find((c) => a.id === c.id).checked}
                    onChange={(event) => {
                      setChecked(
                        checked.map((c) => {
                          if (c.id === a.id) {
                            return {
                              id: c.id,
                              checked: event.currentTarget.checked,
                            };
                          }
                          return c;
                        }),
                      );
                      const currentActivities = [...activities];
                      setActivities(
                        event.currentTarget.checked
                          ? [...currentActivities, a.id]
                          : currentActivities.filter((ca) => ca !== a.id),
                      );
                    }}
                  />
                  <label htmlFor={a.title}>{a.title}</label>
                </div>
              );
            })}
          </div>
          <h2>Login info</h2>
          <label>
            Email <br />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
          </label>
          <br />
          <label>
            Password
            <br />
            <input
              type="password"
              required
              value={pw}
              onChange={(event) => setPw(event.currentTarget.value)}
            />
          </label>
          <br />
        </div>
        {errorInfo && <h2>{errorInfo}</h2>}
        {activityInputError && <h2>{activityInputError}</h2>}
        <button className="buttonStyles">Sign up</button>
      </form>
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
        destination: `https://${context.req.headers.host}/register`,
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
  // otherwise fetch the activities
  const activities = await getActivities();

  return {
    props: { activities, csrfToken: createCsrfToken() },
  };
}
