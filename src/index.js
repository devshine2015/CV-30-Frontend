import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { defaults, resolvers } from './store';
import { persistCache } from 'apollo-cache-persist';
import localForage from 'localforage';

(async () => {
    const cache = new InMemoryCache();

    const stateLink = withClientState({
        resolvers,
        cache,
        defaults
    });

    await persistCache({
        cache,
        storage: localForage,
        maxSize: false,
        debug: process.env.NODE_ENV === 'production'
    });

    const httpLink = new HttpLink({
        uri: process.env.NODE_ENV === 'production' ? 'https://api.cv30.co/graphql' : 'http://localhost/graphql',
        credentials: 'include'
    });

    const client = new ApolloClient({
        // link: createHttpLink({
        //     uri: process.env.NODE_ENV === 'production' ? 'https://api.cv30.co/graphql' : 'http://localhost/graphql',
        //     credentials: 'include'
        // }),
        link: ApolloLink.from([stateLink, httpLink]),
        cache
    });

    client.onResetStore(async () => {
        await stateLink.writeDefaults();
    });

    ReactDOM.render(
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>,
        document.getElementById('root')
    );
})();

// const client = new ApolloClient({
//     uri: process.env.NODE_ENV === 'production' ? 'https://api.cv30.co/graphql' : 'http://localhost/graphql',
//     fetchOptions: {
//         credentials: 'include'
//     },
//     clientState: {
//         resolvers,
//         defaults
//     }
// });