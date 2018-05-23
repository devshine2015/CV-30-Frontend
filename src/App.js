import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Auth from './components/auth';
import LandingPage from './components/landingPage';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route exact path='/auth' component={Auth} />
        </Switch>
      </Router>
    );
  }
}

export default App;
