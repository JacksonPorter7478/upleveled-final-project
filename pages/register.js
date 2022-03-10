import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createMutation } from '../util/client';
import { getSessionByToken } from '../util/database';

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

export default function Registration() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();
  const [createNewUser, { data, loading, error }] = useMutation(createMutation);

  async function submitRegistration(event) {
    event.preventDefault();
    try {
      const user = await createNewUser({
        variables: { name: name, bio: bio, email: email, pw: pw },
      });
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
      <h1 className="h1Font">Sign up</h1>
      {error && <h2>{error.message}</h2>}
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
            <div>
              <input type="checkbox" id="hiking" />
              <label htmlFor="hiking">Hiking</label>
            </div>
            <div>
              <input type="checkbox" id="gym" />
              <label htmlFor="gym">Gym</label>
            </div>

            <div>
              <input type="checkbox" id="team" />
              <label htmlFor="team">Team Sports</label>
            </div>
            <div>
              <input type="checkbox" id="outdoor" />
              <label htmlFor="outdoor">Outdoor activities</label>
            </div>
            <div>
              <input type="checkbox" id="dancing" />
              <label htmlFor="dancing">Dancing</label>
            </div>
            <div>
              <input type="checkbox" id="cinema" />
              <label htmlFor="cinema">Cinema</label>
            </div>
            <div>
              <input type="checkbox" id="concerts" />
              <label htmlFor="concerts">Concerts</label>
            </div>
            <div>
              <input type="checkbox" id="climbing" />
              <label htmlFor="climbing">Climbing</label>
            </div>
            <div>
              <input type="checkbox" id="theater" />
              <label htmlFor="theater">Theater</label>
            </div>
            <div>
              <input type="checkbox" id="museums" />
              <label htmlFor="museums">Museums</label>
            </div>
            <div>
              <input type="checkbox" id="pubs" />
              <label htmlFor="pubs">Pubs & Bars</label>
            </div>
            <div>
              <input type="checkbox" id="cafes" />
              <label htmlFor="cafes">Restaurants & Cafés</label>
            </div>
            <div>
              <input type="checkbox" id="arts" />
              <label htmlFor="arts">Arts & Crafts</label>
            </div>
            <div>
              <input type="checkbox" id="running" />
              <label htmlFor="running">Running</label>
            </div>
            <div>
              <input type="checkbox" id="lectures" />
              <label htmlFor="lectures">Lectures & Discussions</label>
            </div>
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
  // otherwise render this login page
  return {
    props: {},
  };
}
