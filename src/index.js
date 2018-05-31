import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
// import { withClientState } from 'apollo-link-state';
import { defaults, resolvers } from './store';

const CV30_TOKEN_HEADER = 'aaa';
const CV30_REFRESH_TOKEN_HEADER = 'bbb';
// const cache = new InMemoryCache();

/*persistCache({
    cache,
    storage: AsyncStorage,
    debug: true
});*/

/*const stateLink = withClientState({
    resolvers,
    cache,
    defaults
});

const httpLink = new HttpLink({
    uri: '/graphql'
});

const authLink = setContext(async (_, { headers }) => {
    let credentials = null;
    let token = "";
    let refreshToken = "";
    try {
        // credentials = await Keychain.getGenericPassword();
        if (credentials) {
            credentials = credentials.password.split(' _|_|_ ');
            token = "Bearer " + credentials[0];
            refreshToken = credentials[1];
        }
    } catch(err) {}
    return {
        headers: {
            ...headers,
            [CV30_TOKEN_HEADER]: token,
            [CV30_REFRESH_TOKEN_HEADER]: refreshToken
        }
    };
});*/

const client = new ApolloClient({
    uri: 'http://ec2-52-214-122-126.eu-west-1.compute.amazonaws.com:3000/graphql',
    fetchOptions: {
        credentials: 'same-origin'
    },
    // request: async (operation) => {
    //     // const token = await AsyncStorage.getItem('token');
    //     operation.setContext({
    //         headers: {
    //         authorization: ""
    //         }
    //     });
    // },
    onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            // sendToLoggingService(graphQLErrors);
        }
        if (networkError) {
            // logoutUser();
        }
    },
    clientState: {
        defaults,
        resolvers
    }/*,
    cacheRedirects: {
      Query: {
        movie: (_, { id }, { getCacheKey }) =>
          getCacheKey({ __typename: 'Movie', id });
      }
    }*/
});

client.onResetStore(async () => {
    // await Keychain.resetGenericPassword();
    // await stateLink.writeDefaults();
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);