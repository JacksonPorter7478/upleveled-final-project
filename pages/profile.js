import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../components/Header';
import {
  getActivities,
  getActivitiesByUserId,
  getSessionByToken,
  getUserById,
} from '../util/database';
import {
  addActivity,
  deleteMutation,
  deleteUserActivities,
  updateMutation,
} from './api/client';

const formStyles = css`
  text-align: justify;
  align-items: center;
  h2,
  h3 {
    margin: 16px 0 0 0;
  }
  p {
    margin: 0 0 20px 0;
  }
  textarea {
    display: block;
    width: 80%;
    min-height: 70px;
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

const deleteStyles = css`
  padding: 2px 6px;
  margin-top: 50px;
  border: 2px solid black;
  border-radius: 4px;
  background-color: transparent;
  :hover {
    border: 2px solid cadetblue;
  }
`;

export default function Registration(props) {
  // use custom error messages
  const [error, setError] = useState('');
  // error if less than 4 activities are selected
  const [activityInputError, setActivityInputError] = useState('');
  const [name, setName] = useState(props.currentUser.name);
  const [avatar, setAvatar] = useState(props.currentUser.avatar);
  const [bio, setBio] = useState(props.currentUser.bio);
  const [activities, setActivities] = useState(props.chosenActivities);
  const [checked, setChecked] = useState(
    props.dbActivities.map((a) => {
      return { id: a.id, checked: activities.some((b) => b.id === a.id) };
    }),
  );
  const router = useRouter();
  // MUTATIONS
  const [deleteAccount] = useMutation(deleteMutation);
  const [deleteActivities] = useMutation(deleteUserActivities);
  const [updateActivities] = useMutation(addActivity);
  const [updateUser] = useMutation(updateMutation);

  const id = props.currentUser.id;
  // md5 hash for the gravatar image
  const md5 = require('md5');
  const gravatar = `https://www.gravatar.com/avatar/${md5(
    props.currentUser.email.toLowerCase(),
  )}`;

  async function submitUserUpdate(event) {
    event.preventDefault();
    // clear the error message
    setActivityInputError('');
    // set error message if necessary
    if (activities.length < 4) {
      setActivityInputError('Please choose at least 4 activities');
      return;
    }
    try {
      // delete the users activities
      await deleteActivities({ variables: { userId: id } });
      // and save the new activities
      for (const activity of activities) {
        await updateActivities({
          variables: {
            userId: id,
            activityId: activity.id,
          },
        });
      }
      // update name, bio, avatar
      await updateUser({
        variables: {
          id: id,
          name: name,
          avatar: avatar,
          bio: bio,
        },
      });
      // redirect to their users page
      await router.push(`/users/${id}`);
    } catch (err) {
      setError('Something went wrong. Please try again later!');
    }
  }

  async function deleteUserAccount() {
    try {
      await deleteAccount({ variables: { id: id } });
      await router.push('/goodbye');
    } catch (err) {
      setError('Something went wrong. Please try again later!');
    }
  }

  return (
    <>
      <Head>
        <title>Buddies - edit your profile</title>
        <meta
          name="description"
          content="Buddies. The chat app to find your people in Vienna."
        />
      </Head>
      <Header user={props.currentUser} />
      <h1 className="h1Font">
        Edit profile{' '}
        <Image
          src="/paperIcon.png"
          width="40px"
          height="40px"
          alt="the buddies logo: a paper airplane"
        />
      </h1>

      <form
        css={formStyles}
        className="flexColumn responsive"
        onSubmit={submitUserUpdate}
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

          <h2>Interests</h2>
          <label>
            Let other people know what kind of activities you're interested in:
            <textarea
              placeholder="e.g. Looking for some gym buddies"
              minLength="50"
              maxLength="300"
              value={bio}
              required
              onChange={(event) => setBio(event.currentTarget.value)}
            />
          </label>
          <div css={checkboxStyles}>
            <h3>Your Categories</h3>
            <p>Please choose at least 4</p>
            {/* map over all activities from the database */}
            {props.dbActivities.map((a) => {
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
                          ? [...currentActivities, { id: a.id, title: a.title }]
                          : currentActivities.filter((ca) => ca.id !== a.id),
                      );
                    }}
                  />
                  <label htmlFor={a.title}>{a.title}</label>
                </div>
              );
            })}
          </div>

          <h2 id="radio">Profile picture</h2>
          <p>Please choose an avatar</p>
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
                <Image
                  src="/duck.jpg"
                  alt="a baby duck mid-walk"
                  width="80px"
                  height="80px"
                />
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
                  width="80px"
                  height="80px"
                  src="/kitten.jpg"
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
                  src="/puppy.jpg"
                  width="80px"
                  height="80px"
                  alt="portrait of a puppy with a somewhat mischieveous twinkle in its eye"
                />
              </label>
            </div>
            <div>
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
        </div>
        {activityInputError && <h2>{activityInputError}</h2>}
        {error && <h2>{error}</h2>}
        <button className="buttonStyles">Save</button>
      </form>
      <button css={deleteStyles} onClick={() => deleteUserAccount()}>
        Delete my profile
      </button>
    </>
  );
}

export async function getServerSideProps(context) {
  // check if there is already a token in the cookie
  const token = context.req.cookies.sessionToken;

  // if there is, pass on the user
  if (token) {
    const session = await getSessionByToken(token);
    if (session) {
      const currentUser = await getUserById(session.userId);
      // get all activities
      const dbActivities = await getActivities();
      // get the list of activities the user chose
      const chosenActivities = await getActivitiesByUserId(currentUser.id);
      return {
        props: {
          currentUser,
          dbActivities,
          chosenActivities,
        },
      };
    }
  }

  // if they aren't logged in, redirect
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
