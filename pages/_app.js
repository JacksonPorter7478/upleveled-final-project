import '../styles/global.css';
import { ApolloProvider } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { client } from '../util/client';

function MyApp({ Component, pageProps }) {
  // const [user, setUser] = useState();

  // const getCurrentUser = useCallback(() => {
  //   // api route
  //   //
  //   setUser();
  // }, []);

  // useEffect(() => {
  //   getCurrentUser().catch((error) => console.log(error));
  // }, [getCurrentUser]);

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
