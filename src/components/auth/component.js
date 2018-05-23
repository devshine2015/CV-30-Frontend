import React from 'react';
import { Grid, Paper, TextField, Button, Hidden } from '@material-ui/core';

const Auth = ({ classes, email, confirmPassword, password, emailError, passwordError, confirmPasswordError, updateEmail, updateConfirmPassword, updatePassword, handleForm, step, updateStep }) => {
    const RegisterButton = ({ onClick, disabled }) => (
        <Button variant="raised" color="primary" type="submit" onClick={onClick} className={classes.registerButton} disabled={disabled}>
            Register
        </Button>
    );

    const LoginButton = ({ onClick, disabled }) => (
        <Button variant="raised" color="primary" className={classes.loginButton} onClick={onClick} disabled={disabled}>
            Log in
        </Button>
    );

    const OrSeparator = () => (
        <div className={classes.divSeparator}>
            <hr className={classes.separatorHR} />
            <div className={classes.orText}>or</div>
        </div>
    );

    return (
        <div id="login" className={classes.root}>
            <Grid container>
                <Grid item md={12} sm={12} xs={12}>
                    <a href="/" className={classes.brand}>
                        <img src="http://brandmark.io/logo-rank/random/pepsi.png" className={classes.roundedImage} alt="alupigus" />
                        Brand
                    </a>
                </Grid>
            </Grid>
            <Grid container className={classes.loginContainer}>
                <Hidden mdDown>
                    <Grid item md={4} className={classes.loginMessages}>
                        <h1>Logheaza-te</h1>
                        <p>
                            Lorem ipsum dolor sit amet, ut audire legendos eum, cu per postea audiam voluptua, cum ut tollit officiis suscipiantur.
                                Duo id sumo wisi. In sed dolorum repudiandae, cu qui dicant legere aeterno, vim melius regione mnesarchum id.
                                His an vero splendide, eruditi iudicabit torquatos his et. An iuvaret impedit accommodare eum.
                        </p>
                    </Grid>
                </Hidden>
                <Grid item md={4} sm={12} xs={12} className={classes.loginFormContainer}>
                    <Paper className={classes.loginForm}>
                        <form className={classes.loginForm} autoComplete="off" noValidate>
                            <TextField
                                id="email"
                                label="Email"
                                className={classes.textField}
                                type="email"
                                value={email}
                                onChange={event => updateEmail(event.target.value.trim())}
                                error={!!emailError}
                                helperText={emailError ? "Invalid email address" : ""}
                            />
                            {step !== 'forgot' &&
                                <TextField
                                    id="password"
                                    label="Password"
                                    className={classes.textField}
                                    type="password"
                                    value={password}
                                    onChange={event => updatePassword(event.target.value.trim())}
                                    error={!!passwordError}
                                    helperText={passwordError ? "Minimum 3 characters" : ""}
                                />
                            }
                            {step === 'register' &&
                                <TextField
                                    id="passwordConfirm"
                                    label="Confirm Password"
                                    className={classes.textField}
                                    type="password"
                                    value={confirmPassword}
                                    onChange={event => updateConfirmPassword(event.target.value.trim())}
                                    error={!!(confirmPasswordError || (password !== confirmPassword && confirmPassword))}
                                    helperText={confirmPasswordError || (password !== confirmPassword && confirmPassword) ? "Passwords do not match" : ""}
                                />
                            }

                            {step === 'signIn' &&
                                <p className={classes.forgotPass}>
                                    <a href="/" className={classes.forgotLink} onClick={event => { event.preventDefault(); updateStep('forgot'); }}>Forgot password</a>
                                </p>}

                            {step === 'signIn' && [
                                <LoginButton key="auth_1" onClick={handleForm} disabled={!email || !password || passwordError || emailError} />,
                                <OrSeparator key="auth_2" />,
                                <RegisterButton key="auth_3" onClick={() => updateStep('register')} />]}

                            {step === 'register' && [
                                <RegisterButton key="auth_4" onClick={handleForm} disabled={!email || !password || !confirmPassword || emailError || passwordError || confirmPasswordError}/>,
                                <OrSeparator key="auth_5" />,
                                <LoginButton key="auth_6" onClick={() => updateStep('signIn')}  />]}

                            {step === 'forgot' && [
                                <Button key="auth_7" variant="raised" color="primary" className={classes.registerButton} disabled={!email || emailError} onClick={handleForm}>
                                    Reset password
                                </Button>,
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