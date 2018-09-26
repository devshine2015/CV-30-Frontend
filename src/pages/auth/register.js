import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withHandlers, withState } from 'recompose';
import { graphql } from 'react-apollo';
import { RegisterMutation } from '../../store/queries';
import { Link, withRouter } from 'react-router-dom';
import { withFormik } from 'formik';

import { registerValidations } from './validations';

const RegisterHOC = compose(
    withRouter,
    withState('registerError', 'setRegisterError', null),
    graphql(RegisterMutation, {
        name: 'registerMutation'
    }),
    withFormik({
        mapPropsToValues: () => ({
            email: '',
            password: '',
            confirmPassword: ''
        }),
        validationSchema: registerValidations,
        handleSubmit: async (values, { props: { registerMutation, match, history, setRegisterError }, setSubmitting }) => {
            setSubmitting(true);
            const { email, password } = values;

            try {
                let response = await registerMutation({
                    variables: {
                        nickname: email,
                        email,
                        password
                    }
                });
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
                setRegisterError(err || err.message || 'Something went wrong.');
            }

        }
    }),
    withHandlers({
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


const RegisterComponent = ({ values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit, isValid, match, registerError }) => {
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
                            <TextField
                                name="email"
                                label="Email"
                                className='textField'
                                type="email"
                                autoComplete="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                error={!!(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <TextField
                                name="password"
                                label="Password"
                                className='textField'
                                type="password"
                                autoComplete="new-password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                            />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                className='textField'
                                type="password"
                                autoComplete="off"
                                autofill="off"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!(touched.confirmPassword && errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                            />

                            {registerError &&
                                <p className='errorMessage'>{JSON.stringify(registerError)}</p>
                            }

                            <FormattedMessage id="actions.register" defaultMessage="Log in" description="Register action">
                                {(text) => (
                                    <Button className='loginButton' disabled={!isValid || isSubmitting} onClick={handleSubmit}>{text}</Button>
                                )}
                            </FormattedMessage>

                            <OrSeparator />

                            <FormattedMessage id="actions.login" defaultMessage="Log in" description="Log in action">
                                {(text) => (
                                    <Button variant="raised" color="primary" type="button" className='registerButton' component={Link} to={`/${match.params.lang}/login`} disabled={isSubmitting}>
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

export default RegisterHOC(RegisterComponent);