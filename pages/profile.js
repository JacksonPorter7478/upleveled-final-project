import { useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { useState } from 'react';
import { updateMutation } from '../util/client';

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
  const [id, setId] = useState('');
  const [updateUser] = useMutation(updateMutation);

  async function submitUserUpdate(event) {
    event.preventDefault();
    const user = await updateUser({
      variables: { id: id, name: name, bio: bio },
    }).catch((error) => console.log(error));
  }

  return (
    <div className="pageStyles">
      <h1 className="h1Font">Your Profile</h1>
      <form css={formStyles} className="flexColumn" onSubmit={submitUserUpdate}>
        <div>
          <label>
            <h2>Name</h2>
            <input
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </label>
          <label>
            <h2>ID</h2>
            <input
              value={id}
              onChange={(event) => setId(event.currentTarget.value)}
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
        </div>
        <button className="buttonStyles">Save</button>
      </form>
    </div>
  );
}
