import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IS_AUTHENTICATED } from '../store/queries';
import { Query } from 'react-apollo';

const ProtectedRoute = (props) =>
  <Query query={IS_AUTHENTICATED}>
    {({ data: { isAuthenticated } }) => isAuthenticated ? <Route {...props} /> : <Redirect to="/auth" />}
  </Query>

export default ProtectedRoute;