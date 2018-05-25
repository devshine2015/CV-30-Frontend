import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { IntlProvider, addLocaleData } from 'react-intl';
import Auth from './components/auth';
import LandingPage from './components/landingPage';
import romanian from 'react-intl/locale-data/ro';

addLocaleData([...romanian]);

const CVRouter = (props) => {
  return (
    <IntlProvider locale={props.match.params.lang}>
      <Switch>
        <Route exact path='/:lang(en|ro)' component={LandingPage} />
        <Route exact path='/:lang(en|ro)/auth' component={Auth} />
      </Switch>
    </IntlProvider>
  );
};

class App extends Component {
  render() {
    return (
      <BrowserRouter >
        <Switch>
          <Route path='/:lang(en|ro)' component={CVRouter} />
          <Route path='/:segment(auth|job|brand)' component={(props) => <Redirect to={`/${navigator.language.substr(0, 2)}/${props.location.pathname.replace(/^\/+/, "")}`} />} />
          <Redirect from='/' to={'/en'} />
        </Switch>
      </BrowserRouter>

    );
  }
}

export default App;