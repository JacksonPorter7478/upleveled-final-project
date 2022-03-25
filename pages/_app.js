import '../styles/global.css';
import { ApolloProvider } from '@apollo/client';
import Layout from '../components/Layout';
import { client } from './api/client';

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

// baby duck photo
// Photo by <a href="https://unsplash.com/@tunebasics?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kerin Gedge</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// puppy
// Photo by <a href="https://unsplash.com/@blueskiesburning?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ignacio R</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// kitten
// Photo by <a href="https://unsplash.com/@elodieoudot?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Elodie Oudot</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// picknick in a park photo
// Photo by <a href="https://unsplash.com/@masondahl?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mason Dahl</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// paper airplane
// <a href="https://www.flaticon.com/free-icons/mail" title="mail icons">Mail icons created by Freepik - Flaticon</a>
