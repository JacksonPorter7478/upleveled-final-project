import { css } from '@emotion/react';

const formStyles = css`
  align-items: center;
  input {
    border-radius: 4px;
    border: 2px solid powderblue;
  }
  button {
    margin-top: 20px;
  }
`;

export default function Login() {
  return (
    <div className="pageStyles">
      <h1 className="h1Font">Sign in</h1>
      <form
        css={formStyles}
        className="flexColumn"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div>
          <label>
            Name
            <br />
            <input />
          </label>
          <br />
          <label>
            Password
            <br />
            <input type="password" />
          </label>
          <br />
        </div>
        <button className="buttonStyles">Sign in</button>
      </form>
    </div>
  );
}
