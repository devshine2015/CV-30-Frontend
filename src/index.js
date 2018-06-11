import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { defaults, resolvers } from './store';

const client = new ApolloClient({
    uri: process.env.NODE_ENV === 'production' ? 'https://api.cv30.co/graphql' : 'http://localhost/graphql',
    fetchOptions: {
        credentials: 'same-origin'
    },
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
    }
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);