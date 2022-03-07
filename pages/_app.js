import '../styles/global.css';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/Layout';
import { client } from '../util/client';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
