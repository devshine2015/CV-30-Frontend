import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { LoginMutation } from '../../store/queries';
import { Link, withRouter } from 'react-router-dom';
import { isValidEmail } from '../../constants/utils';

const LoginComponent = ({ match, email, password, updateEmail, updatePassword, emailError, passwordError, loading, doLogin, loginError }) => {
    const OrSeparator = () => (
        <div className='divSeparator'>
            <hr className='separatorHR' />
            <FormattedMessage id="login.or" defaultMessage="or" description="or">
                {(text) => (
                    <div className='orText'>{text}</div>
                )}
            </FormattedMessage>
        </div>
    );

    return (
        <div id="login" className="authContainer">
            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                    <Link to="/" className="brand">
                        <img src="http://brandmark.io/logo-rank/random/pepsi.png" className='roundedImage' alt="pepsic" />
                        Brand
                    </Link>
                </Grid>
            </Grid>

            <Grid container className='authContents'>
                <Hidden mdDown>
                    <Grid item lg={4} className='authMessages'>
                        <FormattedMessage id="login.title" defaultMessage="Log in" description="Log in">
                            {(text) => (<h1>{text}</h1>)}
                        </FormattedMessage>
                        <FormattedMessage id="login.text" defaultMessage="Log in text" description="Log in text">
                            {(text) => (<p>{text}</p>)}
                        </FormattedMessage>
                    </Grid>
                </Hidden>
                <Grid item lg={4} md={8} sm={12} xs={12} className='authFormContainer'>
                    <Paper className='authForm'>
                        <form autoComplete="off" noValidate>
                            <FormattedMessage id="login.invalidEmail" defaultMessage="Invalid email addressssss" description="Log in invalid email text">
                                {(text) => (
                                    <TextField
                                        id="email"
                                        label="Email"
                                        className='textField'
                                        type="email"
                                        value={email}
                                        onChange={event => updateEmail(event.target.value.trim())}
                                        error={!!emailError}
                                        helperText={emailError ? text : ""}
                                    />
                                )}
                            </FormattedMessage>

                            <FormattedMessage id="login.shortPassError" defaultMessage="Minimum 3 characters" description="Log in password error text">
                                {(text) => (
                                    <TextField
                                        id="password"
                                        label="Password"
                                        className='textField'
                                        type="password"
                                        value={password}
                                        onChange={event => updatePassword(event.target.value.trim())}
                                        error={!!passwordError}
                                        helperText={passwordError ? text : ""}
                                    />
                                )}
                            </FormattedMessage>

                            <FormattedMessage id="login.forgotPassword" defaultMessage="Forgot password" description="Forgot password">
                                {(text) => (
                                    <p className='forgotPass'>
                                        <Link to={`/${match.params.lang}/forgot`} className='forgotLink'>
                                            {text}
                                        </Link>
                                    </p>)}
                            </FormattedMessage>

                            {loginError &&
                                <p className='errorMessage'>{loginError}</p>
                            }

                            <FormattedMessage id="actions.logIn" defaultMessage="Log in" description="Log in action">
                                {(text) => (<Button variant="raised" className='loginButton' onClick={doLogin} disabled={!email || !password || passwordError || emailError || loading}>
                                    {text}
                                </Button>)}
                            </FormattedMessage>

                            <OrSeparator />

                            <FormattedMessage id="actions.register" defaultMessage="Register" description="Register action">
                                {(text) => (
                                    <Button variant="raised" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/register`} disabled={loading}>
                                        {text}
                                    </Button>
                                )}
                            </FormattedMessage>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};


const LoginHOC = compose(
    withRouter,
    graphql(LoginMutation, {
        name: 'loginMutation'
    }),
    withState('email', 'setEmail', ''),
    withState('emailError', 'setEmailError', null),
    withState('password', 'setPassword', ''),
    withState('passwordError', 'setPasswordError', null),
    withState('loginError', 'setLoginError', null),
    withState('loading', 'setLoadingState', false),
    withHandlers({
        updatePassword: ({ setPassword, setPasswordError }) => (password) => {
            setPassword(password);
            setPasswordError(password.length < 4);
        },
        updateEmail: ({ setEmail, setEmailError }) => (email) => {
            setEmail(email);
            setEmailError(!isValidEmail(email));
        },
        doLogin: (props) => async () => {
            const { email, password, loginMutation, setLoginError, match, history, setLoadingState } = props;
            setLoadingState(true);
            try {
                let response = await loginMutation({
                    variables: {
                        email,
                        password
                    }
                });
                let { err, status } = response.data.login;
                if (err) {
                    setLoginError(err.message);
                    return false;
                }
                if (!status) {
                    setLoginError('Something went wrong.');
                    return false;
                }
                history.push(`/${match.params.lang}/dashboard`);

            }
            catch (err) {
                setLoginError(err.message || 'Something went wrong.');
            }
            finally {
                setLoadingState(false);
            }
        }
    }),
    pure
);

export default LoginHOC(LoginComponent);