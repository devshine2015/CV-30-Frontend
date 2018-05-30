import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';

import Auth from './components/auth';
import LandingPage from './components/landingPage';
import Dashboard from './components/dashboard';

//translation stuff
import romanian from 'react-intl/locale-data/ro';

import messages_ro from "./translations/ro.json";
import messages_en from "./translations/en.json";

addLocaleData([...romanian]);
const messages = {
  'ro': messages_ro,
  'en': messages_en
};

const CVRouter = (props) => {
  const language = props.match.params.lang || 'en';
  return (
    <IntlProvider locale={language} messages={messages[language]}>
      <Switch>
        <Route exact path='/:lang(en|ro)' component={LandingPage} />
        <Route exact path='/:lang(en|ro)/auth' component={Auth} />
        <Route path='/:lang(en|ro)/dashboard' component={Dashboard} />
      </Switch>
    </IntlProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/:lang(en|ro)' component={CVRouter} />
      <Route path='/:segment(auth|dashboard)' component={(props) => <Redirect to={`/${navigator.language.substr(0, 2)}/${props.location.pathname.replace(/^\/+/, "")}`} />} />
      <Redirect from='/' to={'/en'} />
    </Switch>
  </BrowserRouter>
);

export default App;