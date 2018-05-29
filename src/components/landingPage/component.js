import React from 'react';
import { Grid, Button, Hidden, IconButton, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

const LandingPage = ({ classes }) => {
    return (
        <div id="landingPage" className={classes.root}>
            <div className={classes.topNav}>
                <Grid container className={classes.navContainer}>
                    <Grid item md={1}>
                        <Link to="/" className={classes.brand}>
                            <img src="http://brandmark.io/logo-rank/random/pepsi.png" className={classes.roundedImage} alt="pepsic" />
                            Brand
                        </Link>
                    </Grid>
                    <Grid item>
                        <FormattedMessage id="actions.logIn" defaultMessage="Log in" description="Log in action">
                            {(text) => (<Button component={Link} to="/auth" variant="raised" type="button" className={classes.loginButton}>
                                {text}
                            </Button>)}
                        </FormattedMessage>

                        <FormattedMessage id="actions.signUp" defaultMessage="Sign up" description="Sign up action">
                            {(text) => (<Button component={Link} to={{
                                pathname: '/auth',
                                state: { step: 'register' }
                            }} variant="raised" color="primary" type="button" className={classes.registerButton}>
                                {text}
                            </Button>)}
                        </FormattedMessage>

                    </Grid>
                </Grid>
                <Grid container className={classes.headlineContainer}>
                    <Grid item md={5} sm={12} xs={12}>
                        <FormattedMessage id="landingPage.introHeadline" defaultMessage="Intro headline" description="Welcome header on app landing page">
                            {(text) => (<h1 className={classes.heading1}>{text}</h1>)}
                        </FormattedMessage>

                        <FormattedMessage id="landingPage.introMessage" defaultMessage="Intro message" description="Welcome message on app landing page">
                            {(text) => (<p className={classes.paragraph}>{text}</p>)}
                        </FormattedMessage>
                    </Grid>
                    <Hidden mdDown>
                        <Grid item md={5} sm={12} xs={12}></Grid>
                    </Hidden>
                </Grid>
            </div>

            <div className={classes.featuresContainer}>
                <Grid container className={classes.featureRow}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <h2 className={classes.featureHeading}>
                            <FormattedMessage id="landingPage.featureHeadline"
                                defaultMessage="Feature headline"
                                description="Feature headline on app landing page"
                            />
                        </h2>
                        <p className={classes.featureText}>
                            <FormattedMessage id="landingPage.featureText"
                                defaultMessage="Feature text"
                                description="Feature text on app landing page"
                            />
                        </p>
                    </Grid>
                </Grid>

                <Grid container className={[classes.featureRow, classes.featureRowReverse].join(' ')}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <FormattedMessage id="landingPage.featureHeadline" defaultMessage="Feature headline" description="Feature headline on app landing page">
                            {(text) => (<h2 className={classes.featureHeading}>{text}</h2>)}
                        </FormattedMessage>
                        <FormattedMessage id="landingPage.featureText" defaultMessage="Feature text" description="Feature text on app landing page">
                            {(text) => (<p className={classes.featureText}>{text}</p>)}
                        </FormattedMessage>
                    </Grid>

                </Grid>

                <Grid container className={classes.featureRow}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <FormattedMessage id="landingPage.featureHeadline" defaultMessage="Feature headline" description="Feature headline on app landing page">
                            {(text) => (<h2 className={classes.featureHeading}>{text}</h2>)}
                        </FormattedMessage>
                        <FormattedMessage id="landingPage.featureText" defaultMessage="Feature text" description="Feature text on app landing page">
                            {(text) => (<p className={classes.featureText}>{text}</p>)}
                        </FormattedMessage>
                    </Grid>

                </Grid>

                <Grid container className={[classes.featureRow, classes.featureRowReverse].join(' ')}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <FormattedMessage id="landingPage.featureHeadline" defaultMessage="Feature headline" description="Feature headline on app landing page">
                            {(text) => (<h2 className={classes.featureHeading}>{text}</h2>)}
                        </FormattedMessage>
                        <FormattedMessage id="landingPage.featureText" defaultMessage="Feature text" description="Feature text on app landing page">
                            {(text) => (<p className={classes.featureText}>{text}</p>)}
                        </FormattedMessage>
                    </Grid>

                </Grid>
            </div>

            <div className={classes.storiesContainer}>
                <Grid container>
                    <Grid item md={6} sm={6} xs={12} className={classes.storiesSliderContainer}>
                        <FormattedMessage id="landingPage.storiesHeadline" defaultMessage="User stories" description="Stories headline on app landing page">
                            {(text) => (<h1 className={classes.storiesSliderTitle}>{text}</h1>)}
                        </FormattedMessage>
                        <div className={classes.sliderControls}>
                            <IconButton className={classes.sliderArrow}>
                                <Icon>arrow_back_ios</Icon>
                            </IconButton>
                            <span className={classes.sliderDot}></span>
                            <span className={[classes.sliderDot, classes.sliderDotActive].join(' ')}></span>
                            <span className={classes.sliderDot}></span>
                            <span className={classes.sliderDot}></span>
                            <IconButton className={classes.sliderArrow}>
                                <Icon>arrow_forward_ios</Icon>
                            </IconButton>
                        </div>
                        <FormattedMessage id="landingPage.slideTitle" defaultMessage="Slide title" description="Slide title on app landing page">
                            {(text) => (<h2 className={classes.slideTitle}>{text}</h2>)}
                        </FormattedMessage>
                        <FormattedMessage id="landingPage.slideText" defaultMessage="Slide text" description="Slide text on app landing page">
                            {(text) => (<p className={classes.slideText}>{text}</p>)}
                        </FormattedMessage>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12} className={classes.storiesImagesContainer}>
                        <img className={classes.slideImage} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwObBmWDaXK4DxechC-rdwErL199LKP6qTC_oIh-5LeoOX-NMC" alt="slide" />
                    </Grid>
                </Grid>
            </div>

            <footer className={classes.footer}>
                <Grid container className={classes.footerContainer}>
                    <Hidden mdDown>
                        <Grid item md={5} sm={12} xs={12}></Grid>
                    </Hidden>
                    <Grid item md={5} sm={12} xs={12}>
                        <FormattedMessage id="landingPage.footerCreateAccount" defaultMessage="Create account" description="Footer create account title on app landing page">
                            {(text) => (<h1 className={classes.heading1}>{text}</h1>)}
                        </FormattedMessage>

                        <FormattedMessage id="landingPage.footerCreateAccountText" defaultMessage="Create account text" description="Footer create account text on app landing page">
                            {(text) => (<p className={classes.paragraph}>{text}</p>)}
                        </FormattedMessage>

                        <Button component={Link} to={{
                            pathname: '/auth',
                            state: { step: 'register' }
                        }} variant="raised" color="primary" type="button" className={classes.footerSignupButton}>
                            Sign up
                        </Button>
                    </Grid>
                </Grid>
                <Grid container className={classes.footerLinks}>
                    <FormattedHTMLMessage id="landingPage.footerCopyright" defaultMessage="Copyright" description="Footer copyright">
                        {(text) => (<Grid item md={2} sm={12} xs={12} className={classes.footerCopyright}>
                            {text}
                        </Grid>)}
                    </FormattedHTMLMessage>

                    <Grid item md={8} sm={12} xs={12} className={classes.footerMenu}>
                        <FormattedHTMLMessage id="nav.contact" defaultMessage="Contact" description="Contact button">
                            {(text) => (
                                <Button href="#" className={classes.footerButton}>
                                    {text}
                                </Button>
                            )}
                        </FormattedHTMLMessage>
                        <FormattedHTMLMessage id="nav.help" defaultMessage="Help" description="Help button">
                            {(text) => (
                                <Button href="#" className={classes.footerButton}>
                                    {text}
                                </Button>
                            )}
                        </FormattedHTMLMessage>

                        <FormattedHTMLMessage id="nav.termsOfUse" defaultMessage="Terms" description="Terms button">
                            {(text) => (
                                <Button href="#" className={classes.footerButton}>
                                    {text}
                                </Button>
                            )}
                        </FormattedHTMLMessage>
                        <FormattedHTMLMessage id="nav.privaciPolicy" defaultMessage="Privacy" description="Privacy button">
                            {(text) => (
                                <Button href="#" className={classes.footerButton}>
                                    {text}
                                </Button>
                            )}
                        </FormattedHTMLMessage>
                    </Grid>
                    <Grid item md={2} sm={12} xs={12} className={classes.footerSocial}>
                        <Button href="#" className={classes.footerSocialButton}>
                            <i className="fab fa-twitter"></i>
                        </Button>
                        <Button href="#" className={classes.footerSocialButton}>
                            <i className="fab fa-facebook-f"></i>
                        </Button>
                        <Button href="#" className={classes.footerSocialButton}>
                            <i className="fab fa-youtube"></i>
                        </Button>
                        <Button href="#" className={classes.footerSocialButton}>
                            <i className="fab fa-google-plus-g"></i>
                        </Button>
                    </Grid>
                </Grid>
            </footer>
        </div>
    );
}

export default LandingPage;