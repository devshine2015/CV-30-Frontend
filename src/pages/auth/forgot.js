import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { ForgotPasswordMutation } from '../../store/queries';
import { Link, withRouter } from 'react-router-dom';
import { isValidEmail } from '../../constants/utils';

const ForgotPasswordComponent = ({ match, updateEmail, sendMail, state: { email, emailError, loading, forgotError } }) => {
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

                            <FormattedMessage id="actions.resetPassword" defaultMessage="Reset password" description="Reset password action">
                                {(text) => (<Button variant="contained" className='loginButton' onClick={sendMail} disabled={!email || emailError || loading}>
                                    {text}
                                </Button>)}
                            </FormattedMessage>

                            <OrSeparator />

                            <Grid container spacing={8}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <FormattedMessage id="actions.register" defaultMessage="Register" description="Register action">
                                        {(text) => (
                                            <Button variant="contained" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/register`} disabled={loading}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                </Grid>
                                <Grid item md={6} sm={6} xs={12}>
                                    <FormattedMessage i id="actions.logIn" defaultMessage="Log in" description="Log in action">
                                        {(text) => (
                                            <Button variant="contained" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/login`} disabled={loading}>
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
    withState('state', 'setState', {
        email: '',
        loading: false,
        emailError: null,
        forgotError: null
    }),
    withHandlers({
        updateEmail: ({ state, setState }) => (email) => setState({
            email,
            emailError: !isValidEmail(email)
        }),
        sendMail: (props) => async () => {
            const { state, setState, forgotMutation, match, history } = props;
            const { email } = state;
            setState({ ...state, loading: true });
            try {
                let response = await forgotMutation({
                    variables: {
                        email
                    }
                });

                setState({ ...state, loading: false });
                let { error, status } = response.data.forgotPassword;

                if (error) {
                    setState({ ...state, forgotError: error || error.message || 'Something went wrong.' });
                    return false;
                }
                if (!status) {
                    setState({ ...state, forgotError: 'Something went wrong.' });
                    return false;
                }
                history.push(`/${match.params.lang}/login`);
            }
            catch (error) {
                setState({
                    ...state,
                    loading: false,
                    forgotError: error || error.message || 'Something went wrong.'
                });
            }
        }
    }),
    pure
);

export default ForgotPasswordHOC(ForgotPasswordComponent);