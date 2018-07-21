import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { RegisterMutation } from '../../store/queries';
import { Link, withRouter } from 'react-router-dom';
import { isValidEmail } from '../../constants/utils';

const RegisterComponent = ({ match, email, password, confirmPassword, updateEmail, updatePassword, updateConfirmPassword, emailError, passwordError, confirmPasswordError, doRegister, registerError, loading }) => {
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
                    <Grid item md={4} className='authMessages'>
                        <FormattedMessage id="register.title" defaultMessage="Sign up" description="Log in">
                            {(text) => (<h1>{text}</h1>)}
                        </FormattedMessage>
                        <FormattedMessage id="register.text" defaultMessage="Sign up text" description="Log in text">
                            {(text) => (<p>{text}</p>)}
                        </FormattedMessage>
                    </Grid>
                </Hidden>
                <Grid item md={4} sm={12} xs={12} className='authFormContainer'>
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

                            <FormattedMessage id="login.passNoMatch" defaultMessage="Passwords do not match" description="Log in passwords match error text">
                                {(text) => (
                                    <TextField
                                        id="passwordConfirm"
                                        label="Confirm Password"
                                        className='textField'
                                        type="password"
                                        value={confirmPassword}
                                        onChange={event => updateConfirmPassword(event.target.value.trim())}
                                        error={!!(confirmPasswordError || (password !== confirmPassword && confirmPassword))}
                                        helperText={confirmPasswordError || (password !== confirmPassword && confirmPassword) ? text : ""}
                                    />)}
                            </FormattedMessage>

                            {registerError &&
                                <p className='errorMessage'>{registerError}</p>
                            }

                            <FormattedMessage id="actions.register" defaultMessage="Log in" description="Register action">
                                {(text) => (<Button variant="raised" className='loginButton' onClick={doRegister} disabled={!email || !password || !confirmPassword || emailError || passwordError || confirmPasswordError || loading}>
                                    {text}
                                </Button>)}
                            </FormattedMessage>

                            <OrSeparator />

                            <FormattedMessage id="actions.login" defaultMessage="Log in" description="Log in action">
                                {(text) => (
                                    <Button variant="raised" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/login`} disabled={loading}>
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

const RegisterHOC = compose(
    withRouter,
    graphql(RegisterMutation, {
        name: 'registerMutation'
    }),
    withState('email', 'setEmail', ''),
    withState('emailError', 'setEmailError', null),
    withState('password', 'setPassword', ''),
    withState('passwordError', 'setPasswordError', null),
    withState('confirmPassword', 'setConfirmPassword', ''),
    withState('confirmPasswordError', 'setConfirmPasswordError', null),
    withState('registerError', 'setRegisterError', null),
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
        updateConfirmPassword: ({ password, setConfirmPassword, setConfirmPasswordError }) => (confirmPassword) => {
            setConfirmPassword(confirmPassword);
            setConfirmPasswordError(password !== confirmPassword);
        },
        doRegister: (props) => async () => {
            const { email, password, registerMutation, setRegisterError, match, history, setLoadingState } = props;
            setLoadingState(true);
            try {
                let response = await registerMutation({
                    variables: {
                        nickname: email,
                        email,
                        password
                    }
                });
                setLoadingState(false);
                let { error, status } = response.data.register;
                if (error) {
                    setRegisterError(error || error.message || 'Something went wrong.');
                    return false;
                }
                if (!status) {
                    setRegisterError('Something went wrong.');
                    return false;
                }
                history.push(`/${match.params.lang}/login`);
            }
            catch (err) {
                console.log(err);
                setLoadingState(false);
                setRegisterError(err || err.message || 'Something went wrong.');
            }
        }
    }),
    pure
);

export default RegisterHOC(RegisterComponent);