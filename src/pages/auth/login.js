import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import { LoginMutation, AuthenticateLocal, loggedInUserProfile } from '../../store/queries';
import { Link, withRouter } from 'react-router-dom';
import { isValidEmail } from '../../constants/utils';

const LoginComponent = props => {
    const { match, email, password, updateEmail, updatePassword, emailError, passwordError, loading, doLogin, loginError } = props;
    const { activationSuccess } = props.location.state || false;
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
                        <form autoComplete="off" noValidate onSubmit={event => doLogin(event)}>
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

                            {
                                loginError &&
                                <p className='errorMessage'>{loginError}</p>
                            }

                            {
                                activationSuccess &&
                                <FormattedMessage id="login.activationSuccess" defaultMessage="You have successfully activated your account." description="Activation message">
                                    {(text) => (
                                        <p className='activationMessage'>{text}</p>
                                    )}
                                </FormattedMessage>
                            }

                            <FormattedMessage id="actions.logIn" defaultMessage="Log in" description="Log in action">
                                {(text) => (<Button variant="raised" type="submit" className='loginButton' disabled={!email || !password || passwordError || emailError || loading}>
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
    withApollo,
    graphql(LoginMutation, {
        name: 'loginMutation'
    }),
    graphql(AuthenticateLocal, { name: 'authLocal' }),
    withState('email', 'setEmail', ''),
    withState('emailError', 'setEmailError', null),
    withState('password', 'setPassword', ''),
    withState('passwordError', 'setPasswordError', null),
    withState('loginError', 'setLoginError', null),
    withHandlers({
        updatePassword: ({ setPassword, setPasswordError }) => (password) => {
            setPassword(password);
            setPasswordError(password.length < 4);
        },
        updateEmail: ({ setEmail, setEmailError }) => (email) => {
            setEmail(email);
            setEmailError(!isValidEmail(email));
        },
        doLogin: props => async ev => {
            ev.preventDefault();
            const { email, password, loginMutation, authLocal, setLoginError, match, history, client, match: { params: { lang: language } } } = props;
            try {
                let response = await loginMutation({
                    variables: {
                        email,
                        password
                    }
                });

                const { error, token, refreshToken, god } = response.data.login;

                if (error) {
                    setLoginError(error || error.message || 'Something went wrong.');
                    return false;
                } else if (!token || !refreshToken) {
                    setLoginError('Something went wrong.');
                    return false;
                } else {
                    let currentUserQuery = await client.query({
                        query: loggedInUserProfile,
                        variables: { language },
                    });

                    const { id, email, firstName, lastName, avatarPath, ownedCompanies } = currentUserQuery.data.profile;
                    const currentUser = { id, email, firstName, lastName, avatarPath, god, ownedCompanies, __typename: 'Profile' };

                    await authLocal({
                        variables: {
                            status: true,
                            user: currentUser
                        }
                    });
                    history.push(`/${match.params.lang}/`);
                }
            } catch (error) {
                console.log(error);
                setLoginError(error.message || 'Something went wrong.');
            }
        }
    }),
    pure
);

export default LoginHOC(LoginComponent);