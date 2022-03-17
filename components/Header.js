import { css } from '@emotion/react';
import Link from 'next/link';

const headerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  p {
    margin: 0;
  }
`;

export default function Header(props) {
  return (
    <div css={headerStyles}>
      <p>
        Logged in as{' '}
        <Link href={`/users/${props.user.id}`}>
          <a>{props.user.name}</a>
        </Link>
      </p>
      <p>
        <a href="/logout">Logout</a>
      </p>
    </div>
  );
}
