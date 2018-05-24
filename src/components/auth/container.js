import { compose, pure, withState, withHandlers, mapProps } from 'recompose';
import { withStyles } from '@material-ui/core';
import Auth from './component';
import styles from './style';

// const isValidEmail = (email) => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
const isValidEmail = (email) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);

const AuthHOC = compose(
    withStyles(styles),
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
        handleForm: ({ email, confirmPassword, password }) => () => {
            return false;
        }

    }),
    pure
)

export default AuthHOC(Auth);