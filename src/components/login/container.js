import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import Login from './component';
import styles from './style';

// const isValidEmail = (email) => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
const isValidEmail = (email) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);

const LoginHOC = compose(
    withStyles(styles),
    withState('step', 'setStep', 'signIn'),
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
        updateConfirmPassword: ({ setConfirmPassword }) => (confirmPassword) => setConfirmPassword(confirmPassword),
        handleForm: ({ email, confirmPassword, password }) => () => {
            console.log(email);
            console.log(confirmPassword);
            console.log(password);
            return false;
        }

    }),
    pure
)

export default LoginHOC(Login);