import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { ForgotPasswordMutation } from '../../store/queries';
import { Link, withRouter } from 'react-router-dom';
import { isValidEmail } from '../../constants/utils';

const ForgotPasswordComponent = ({ match, email, updateEmail, emailError, loading, sendMail, forgotError }) => {
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
        <div id="forgotPassword" className="authContainer">
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

                            {forgotError &&
                                <p className='errorMessage'>{forgotError}</p>
                            }

                            <FormattedMessage id="actions.forgotPassword" defaultMessage="Reset password" description="Reset password action">
                                {(text) => (<Button variant="raised" className='loginButton' onClick={sendMail} disabled={!email || emailError || loading}>
                                    {text}
                                </Button>)}
                            </FormattedMessage>

                            <OrSeparator />

                            <Grid container spacing={8}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <FormattedMessage id="actions.register" defaultMessage="Register" description="Register action">
                                        {(text) => (
                                            <Button variant="raised" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/register`} disabled={loading}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <FormattedMessage i id="actions.logIn" defaultMessage="Log in" description="Log in action">
                                        {(text) => (
                                            <Button variant="raised" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/login`} disabled={loading}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};


const ForgotPasswordHOC = compose(
    withRouter,
    graphql(ForgotPasswordMutation, {
        name: 'forgotMutation'
    }),
    withState('email', 'setEmail', ''),
    withState('emailError', 'setEmailError', null),
    withState('forgotError', 'setForgotError', null),
    withState('loading', 'setLoadingState', false),
    withHandlers({
        updateEmail: ({ setEmail, setEmailError }) => (email) => {
            setEmail(email);
            setEmailError(!isValidEmail(email));
        },
        sendMail: (props) => async () => {
            const { email, forgotMutation, setForgotError, match, history, setLoadingState } = props;
            setLoadingState(true);
            try {
                let response = await forgotMutation({
                    variables: {
                        email
                    }
                });

                let { error, status } = response.data.forgotPassword;

                if (error) {
                    setForgotError(error || error.message || 'Something went wrong.');
                    setLoadingState(false);
                    return false;
                }
                if (!status) {
                    setForgotError('Something went wrong.');
                    setLoadingState(false);
                    return false;
                }
                setLoadingState(false);
                history.push(`/${match.params.lang}/login`);

            }
            catch (error) {
                setForgotError(error || error.message || 'Something went wrong.');
                setLoadingState(false);
            }
        }
    }),
    pure
);

export default ForgotPasswordHOC(ForgotPasswordComponent);