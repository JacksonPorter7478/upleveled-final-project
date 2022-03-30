import { css, Interpolation, Theme } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import { AnchorHTMLAttributes, useState } from 'react';

const headerStyles = css`
  .nav {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    margin: 0;
    background-color: #fffffff7;
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
    display: flex;
    justify-content: space-between;
    height: 50px;
  }
  button {
    background-color: transparent;
    border: none;
    margin: 10px 6px;
  }
  .closed {
    display: none;
  }
  .open {
    display: flex;
    padding: 15px;
    border-right: 3px solid #389583;
    border-bottom: 3px solid #389583;
    border-bottom-right-radius: 4px;
    position: fixed;
    z-index: 2;
    top: 50px;
    left: 0;
    width: max-content;
    margin: 0;
    background-color: white;
    flex-direction: column;
    font-size: 18px;
    a,
    Anchor,
    p {
      margin: 6px;
      color: #545659;
      text-decoration: none;
    }
  }
  .avatar {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 0 10px;
    border-radius: 50%;
    outline: 2px solid #545659;
    overflow: hidden;
    transform: translateY(10px);
  }
`;

type Props = {
  user: {
    id: number;
    name: string;
    avatar: string;
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
  const [menu, setMenu] = useState('closed');

  return (
    <div css={headerStyles}>
      <div className="nav">
        <button onClick={() => setMenu(menu === 'closed' ? 'open' : 'closed')}>
          <Image
            src={menu === 'closed' ? '/menuIcon.png' : '/closeMenuIcon.png'}
            width="25px"
            height="25px"
          />
        </button>
        <div className={`menu ${menu}`}>
          <Link href={`/users/${props.user.id}`}>
            <a>Dashboard</a>
          </Link>
          <Link href="/matches">
            <a>Matches</a>
          </Link>
          <Link href="/profile">
            <a>Profile </a>
          </Link>
          <Link href="/about">
            <a>About </a>
          </Link>
          <p>
            <Anchor href="/logout">➞ Logout</Anchor>
          </p>
        </div>
        <div className="user">
          <Link href={`/users/${props.user.id}`}>
            <a>
              {props.user.name}
              <div className="avatar">
                <Image
                  width="30px"
                  height="30px"
                  src={props.user.avatar}
                  alt={
                    props.user.avatar.length > 10
                      ? 'gravatar profile picture'
                      : `user avatar of a ${props.user.avatar.slice(1, -4)}`
                  }
                />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
