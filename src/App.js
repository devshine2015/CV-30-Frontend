import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import scriptLoader from 'react-async-script-loader';

import LandingPage from './pages/landingPage';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';
import ActivateAccount from './pages/auth/activate';

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
        <GuestRoute exact path='/:lang(en|ro)/login' component={Login} />
        <GuestRoute exact path='/:lang(en|ro)/register' component={Register} />
        <GuestRoute exact path='/:lang(en|ro)/forgot' component={ForgotPassword} />
        <GuestRoute exact path='/:lang(en|ro)/activate/:activationCode' component={ActivateAccount} />
        <ProtectedRoute path='/:lang(en|ro)/dashboard' component={Dashboard} {...props} />
      </Switch>
    </IntlProvider>
  );
};

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/:lang(en|ro)' component={CVRouter} />
      <Route path='/:segment(login|register|forgot|activate|dashboard)' component={(props) => <Redirect to={`/${navigator.language.substr(0, 2)}/${props.location.pathname.replace(/^\/+/, "")}`} />} />
      <Redirect from='/' to={'/en'} />
    </Switch>
  </BrowserRouter>
);

export default scriptLoader('https://maps.googleapis.com/maps/api/js?key=AIzaSyBTQiBfUXeguqDwn0cMRSJGWPFQyFu9OW0&libraries=places')(App);