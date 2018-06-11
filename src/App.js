import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';

import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';

//translation stuff
import romanian from 'react-intl/locale-data/ro';

import messages_ro from "./translations/ro.json";
import messages_en from "./translations/en.json";

import './App.css';

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
        <Route exact path='/:lang(en|ro)' component={LandingPage} {...props} />
        {/*<Route exact path='/:lang(en|ro)/auth' component={Auth} {...props} />*/}
        <Route exact path='/:lang(en|ro)/login' component={Login} />
        <Route exact path='/:lang(en|ro)/register' component={Register} />
        <Route exact path='/:lang(en|ro)/forgot' component={ForgotPassword} />
        <ProtectedRoute path='/:lang(en|ro)/dashboard' component={Dashboard} {...props} />
      </Switch>
    </IntlProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/:lang(en|ro)' component={CVRouter} />
      <Route path='/:segment(login|register|forgot|dashboard)' component={(props) => <Redirect to={`/${navigator.language.substr(0, 2)}/${props.location.pathname.replace(/^\/+/, "")}`} />} />
      <Redirect from='/' to={'/en'} />
    </Switch>
  </BrowserRouter>
);

export default App;