import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createCsrfToken } from '../util/auth';
import { getActivities, getSessionByToken } from '../util/database';
import { addActivity, createMutation } from './api/client';

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

export default function Registration(props) {
  const [name, setName] = useState('');
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
  const router = useRouter();
  const [createNewUser, { loading, error }] = useMutation(createMutation);
  const [addToUser] = useMutation(addActivity);
  const [activityInputError, setActivityInputError] = useState('');

  async function submitRegistration(event) {
    event.preventDefault();
    setActivityInputError('');
    if (activities.length < 5) {
      setActivityInputError('Please choose at least 5 activities');
      return;
    }
    try {
      const user = await createNewUser({
        variables: {
          name: name,
          bio: bio,
          email: email,
          pw: pw,
          csrfToken: props.csrfToken,
        },
      });
      for (const activity of activities) {
        await addToUser({
          variables: {
            userId: user.data.createUser.id,
            activityId: activity,
          },
        });
      }
      router
        .push(`/users/${user.data.createUser.id}`)
        .catch((err) => console.log('router: ' + err));
    } catch (err) {
      console.log('Error creating the user: ' + err);
    }
  }

  if (loading) return 'Creating your profile...';

  return (
    <>
      <p>
        <Link href="/login">
          <a>Sign in instead</a>
        </Link>
      </p>
      <h1 className="h1Font">Sign up</h1>
      {error && <h2>{error.message}</h2>}
      {activityInputError && <h2>{activityInputError}</h2>}
      <form
        css={formStyles}
        className="flexColumn"
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
            <p>Please choose at least 5</p>
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
