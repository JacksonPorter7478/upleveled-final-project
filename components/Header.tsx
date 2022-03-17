import { css, Interpolation, Theme } from '@emotion/react';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';

const headerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  p {
    margin: 0;
  }
`;

type Props = {
  user: {
    id: number;
    name: string;
  };
};

function Anchor({
  children,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  css?: Interpolation<Theme>;
}) {
  return <a {...restProps}>{children}</a>;
}

export default function Header(props: Props) {
  return (
    <div css={headerStyles}>
      <p>
        Logged in as{' '}
        <Link href={`/users/${props.user.id}`}>
          <a>{props.user.name}</a>
        </Link>
      </p>
      <p>
        <Anchor href="/logout">Logout</Anchor>
      </p>
    </div>
  );
}
