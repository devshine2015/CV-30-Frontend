import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import { graphql } from 'react-apollo';
import Auth from './component';
import styles from './style';
import { LoginMutation, RegisterMutation } from '../../store/queries';
import { Redirect, withRouter } from 'react-router-dom';
import React from 'react';

const isValidEmail = (email) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);

const AuthHOC = compose(
    withStyles(styles),
    withRouter,
    graphql(LoginMutation, {
        name: 'loginMutation'
    }),
    graphql(RegisterMutation, {
        name: 'registerMutation'
    }),
    withState('step', 'setStep', props => (props.location.state && props.location.state.step) || 'signIn'),
    withState('email', 'setEmail', ''),
    withState('emailError', 'setEmailError', null),
    withState('password', 'setPassword', ''),
    withState('passwordError', 'setPasswordError', ''),
    withState('confirmPassword', 'setConfirmPassword', ''),
    withState('confirmPasswordError', 'setConfirmPasswordError', ''),
    withHandlers({
        updateStep: ({ setStep, setEmail, setConfirmPassword, setPassword, setEmailError, setConfirmPasswordError, setPasswordError }) => (step) => {
            setEmail('');
            setConfirmPassword('');
            setPassword('');
            setEmailError(null);
            setConfirmPasswordError(null);
            setPasswordError(null);
            setStep(step);
        },
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
        handleForm: (props) => () => {
            let { step, setStep, email, confirmPassword, password, loginMutation, registerMutation, match, history } = props;

            const doRegister = async () => {
                let result = null;
                try {
                    result = await registerMutation({
                        variables: {
                            nickname: email,
                            email,
                            password
                        }
                    });
                } catch (error) {
                    console.log(error);
                    alert('Sowwy ...');
                    return;
                }
                result = result.data.register || null;
                if (!result || result.error || !result.status) {
                    console.log(result);
                    alert(result.error !== "" ? result.error : 'Sowwy ...');
                } else {
                    setStep('signIn');
                }
            }

            const doLogin = async () => {
                let result = null;
                try {
                    result = await loginMutation({
                        variables: {
                            email,
                            password
                        }
                    });

                } catch (err) {
                    console.log(err);
                }

                result = result.data.register || null;
                if (!result || result.error || !result.status) {
                    //store update isAuthenticated
                    history.push(`/${match.params.lang}/dashboard`);
                } else {
                    setStep('signIn');
                }
            }

            switch (step) {
                case 'signIn':
                    doLogin();
                    break;
                case 'register':
                    doRegister();
                    break;
                case 'forgot':
                    break;
                    default:
                    break;
            }
        }
    }),
    pure
)

export default AuthHOC(Auth);