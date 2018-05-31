import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Auth = (props) => {
    const { classes, email, confirmPassword, password, emailError, passwordError, confirmPasswordError, updateEmail, updateConfirmPassword, updatePassword, handleForm, step, updateStep } = props;
    const RegisterButton = ({ onClick, disabled }) => (
        <FormattedMessage id="actions.register" defaultMessage="Register" description="Register action">
            {(text) => (<Button variant="raised" color="primary" type="button" onClick={onClick} className={classes.registerButton} disabled={disabled}>
                {text}
            </Button>)}
        </FormattedMessage>
    );

    const LoginButton = ({ onClick, disabled }) => (
        <FormattedMessage id="actions.logIn" defaultMessage="Log in" description="Log in action">
            {(text) => (<Button variant="raised" color="primary" className={classes.loginButton} onClick={onClick} disabled={disabled}>
                {text}
            </Button>)}
        </FormattedMessage>
    );

    const OrSeparator = () => (
        <div className={classes.divSeparator}>
            <hr className={classes.separatorHR} />
            <FormattedMessage id="login.or" defaultMessage="or" description="or">
                {(text) => (
                    <div className={classes.orText}>{text}</div>
                )}
            </FormattedMessage>
        </div>
    );

    return (
        <div id="login" className={classes.root}>
            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                    <Link to="/" className={classes.brand}>
                        <img src="http://brandmark.io/logo-rank/random/pepsi.png" className={classes.roundedImage} alt="pepsic" />
                        Brand
                    </Link>
                </Grid>
            </Grid>
            <Grid container className={classes.loginContainer}>
                <Hidden mdDown>
                    <Grid item md={4} className={classes.loginMessages}>
                        <FormattedMessage id="login.title" defaultMessage="Log in" description="Log in">
                            {(text) => (<h1>{text}</h1>)}
                        </FormattedMessage>
                        <FormattedMessage id="login.text" defaultMessage="Log in text" description="Log in text">
                            {(text) => (<p>{text}</p>)}
                        </FormattedMessage>
                    </Grid>
                </Hidden>
                <Grid item md={4} sm={12} xs={12} className={classes.loginFormContainer}>
                    <Paper className={classes.loginForm}>
                        <form className={classes.loginForm} autoComplete="off" noValidate>
                            <FormattedMessage id="login.invalidEmail" defaultMessage="Invalid email addressssss" description="Log in invalid email text">
                                {(text) => (
                                    <TextField
                                        id="email"
                                        label="Email"
                                        className={classes.textField}
                                        type="email"
                                        value={email}
                                        onChange={event => updateEmail(event.target.value.trim())}
                                        error={!!emailError}
                                        helperText={emailError ? text : ""}
                                    />
                                )}
                            </FormattedMessage>

                            {step !== 'forgot' &&
                                <FormattedMessage id="login.shortPassError" defaultMessage="Minimum 3 characters" description="Log in password error text">
                                    {(text) => (
                                        <TextField
                                            id="password"
                                            label="Password"
                                            className={classes.textField}
                                            type="password"
                                            value={password}
                                            onChange={event => updatePassword(event.target.value.trim())}
                                            error={!!passwordError}
                                            helperText={passwordError ? text : ""}
                                        />
                                    )}
                                </FormattedMessage>
                            }
                            {step === 'register' &&
                                <FormattedMessage id="login.passNoMatch" defaultMessage="Passwords do not match" description="Log in passwords match error text">
                                    {(text) => (
                                        <TextField
                                            id="passwordConfirm"
                                            label="Confirm Password"
                                            className={classes.textField}
                                            type="password"
                                            value={confirmPassword}
                                            onChange={event => updateConfirmPassword(event.target.value.trim())}
                                            error={!!(confirmPasswordError || (password !== confirmPassword && confirmPassword))}
                                            helperText={confirmPasswordError || (password !== confirmPassword && confirmPassword) ? text : ""}
                                        />)}
                                </FormattedMessage>
                            }

                            {step === 'signIn' &&
                                <FormattedMessage id="login.forgotPassword" defaultMessage="Forgot password" description="Forgot password">
                                    {(text) => (
                                        <p className={classes.forgotPass}>
                                            <a href="/" className={classes.forgotLink} onClick={event => { event.preventDefault(); updateStep('forgot'); }}>{text}</a>
                                        </p>)}
                                </FormattedMessage>
                            }

                            {step === 'signIn' && [
                                <LoginButton key="auth_1" onClick={handleForm} disabled={!email || !password || passwordError || emailError} />,
                                <OrSeparator key="auth_2" />,
                                <RegisterButton key="auth_3" onClick={() => updateStep('register')} />]}

                            {step === 'register' && [
                                <RegisterButton key="auth_4" onClick={handleForm} disabled={!email || !password || !confirmPassword || emailError || passwordError || confirmPasswordError} />,
                                <OrSeparator key="auth_5" />,
                                <LoginButton key="auth_6" onClick={() => updateStep('signIn')} />]}

                            {step === 'forgot' && [
                                <FormattedMessage id="actions.resetPassword" defaultMessage="Reset password" description="Reset password">
                                    {(text) => (
                                        <Button key="auth_7" variant="raised" color="primary" className={classes.registerButton} disabled={!email || emailError} onClick={handleForm}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>,
                                <OrSeparator key="auth_8" />,
                                <Grid key="auth_9" container spacing={8}>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <RegisterButton onClick={() => updateStep('register')} />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <LoginButton key="auth_11" onClick={() => updateStep('signIn')} disabled={false} />
                                    </Grid>
                                </Grid>
                            ]}
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Auth;