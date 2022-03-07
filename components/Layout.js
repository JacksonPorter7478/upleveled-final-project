import Head from 'next/head';

export default function Layout(props) {
  return (
    <div className="pageStyles">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{props.children}</main>
    </div>
  );
}
