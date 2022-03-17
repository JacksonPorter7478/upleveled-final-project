import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
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
    margin: 4vw;
    border-radius: 4px;
    border: 2px solid powderblue;
  }
  input {
    border-radius: 4px;
    border: 2px solid powderblue;
    margin-bottom: 15px;
  }
  button {
    margin-top: 20px;
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
    border: 2px solid powderblue;
    border-radius: 4px;
    :hover {
      border: 2px solid cadetblue;
    }
  }
  input {
    opacity: 0;
    transform: translateX(35px);
    margin: 0;
    :checked + label {
      background-color: powderblue;
    }
    :focus + label {
      border: 2px solid cadetblue;
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
  const [name, setName] = useState(props.user.name);
  const [bio, setBio] = useState(props.user.bio);
  const [activityInputError, setActivityInputError] = useState('');
  const [activities, setActivities] = useState(props.chosenActivities);
  const [checked, setChecked] = useState(
    props.dbActivities.map((a) => {
      return { id: a.id, checked: activities.some((b) => b.id === a.id) };
    }),
  );
  const [deleteAccount] = useMutation(deleteMutation);
  const [deleteActivities] = useMutation(deleteUserActivities);
  const [updateUser] = useMutation(updateMutation);
  const [updateActivities] = useMutation(addActivity);
  const router = useRouter();

  const id = props.user.id;

  async function submitUserUpdate(event) {
    event.preventDefault();
    setActivityInputError('');
    if (activities.length < 5) {
      setActivityInputError('Please choose at least 5 activities');
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
      // update name, bio
      const user = await updateUser({
        variables: {
          id: id,
          name: name,
          bio: bio,
        },
      });
      // redirect to their users page
      router.push(`/users/${id}`).catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteUserAccount() {
    try {
      const user = await deleteAccount({ variables: { id: id } });
      router.push('/goodbye').catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Header user={props.user} />
      <h1 className="h1Font">Your Profile</h1>
      {activityInputError && <h2>{activityInputError}</h2>}
      <form css={formStyles} className="flexColumn" onSubmit={submitUserUpdate}>
        <div>
          <label>
            <h2>Name</h2>
            <input
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
              onChange={(event) => setBio(event.currentTarget.value)}
            />
          </label>
          <div css={checkboxStyles}>
            <h3>Your Categories</h3>
            <p>Please choose at least 5</p>
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
        </div>
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
      const user = await getUserById(session.userId);
      // get all activities
      const dbActivities = await getActivities();
      // get the list of activities the user chose
      const chosenActivities = await getActivitiesByUserId(user.id);
      return {
        props: {
          user,
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
