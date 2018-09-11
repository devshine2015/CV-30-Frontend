import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IS_AUTHENTICATED } from '../store/queries';
import { Query } from 'react-apollo';

const ProtectedRoute = props =>
  <Query query={IS_AUTHENTICATED}>
    {({ data: { auth } }) => auth.currentUser ? <Route {...props} /> : <Redirect to="/login" />}
  </Query>

export default ProtectedRoute;