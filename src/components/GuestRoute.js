import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IS_AUTHENTICATED } from '../store/queries';
import { Query } from 'react-apollo';

export default (props) =>
    <Query query={IS_AUTHENTICATED}>
        {({ data: { auth } }) => {
            const { from } = props.location.state || { from: { pathname: '/' } };
            return !auth.loggedIn ? <Route {...props} /> : <Redirect to='/dashboard' />;
        }}
    </Query>