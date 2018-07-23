import React from 'react';
import { Grid, Button, Hidden } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Footer = props => {
    const { match: { params: { lang } } } = props;

    return (
        <footer className='footer'>
            <Grid container className='footerContainer'>
                <Hidden mdDown>
                    <Grid item md={5} sm={12} xs={12}></Grid>
                </Hidden>
                <Grid item md={5} sm={12} xs={12}>
                    <FormattedMessage id="landingPage.footerCreateAccount" defaultMessage="Create account" description="Footer create account title on app landing page">
                        {(text) => (<h1 className='introHeadline'>{text}</h1>)}
                    </FormattedMessage>

                    <FormattedMessage id="landingPage.footerCreateAccountText" defaultMessage="Create account text" description="Footer create account text on app landing page">
                        {(text) => (<p className='introMessage'>{text}</p>)}
                    </FormattedMessage>

                    <Button component={Link} to={`/${lang}/register`} variant="raised" color="primary" type="button" className='footerSignupButton'>
                        Sign up
                        </Button>
                </Grid>
            </Grid>
            <Grid container className='footerLinks'>
                <FormattedMessage id="landingPage.footerCopyright" defaultMessage="Copyright" description="Footer copyright">
                    {(text) => (<Grid item md={2} sm={12} xs={12} className='footerCopyright'>
                        {text}
                    </Grid>)}
                </FormattedMessage>

                <Grid item md={8} sm={12} xs={12} className='footerMenu'>
                    <FormattedMessage id="nav.contact" defaultMessage="Contact" description="Contact button">
                        {(text) => (
                            <Button href="#" className='footerButton'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="nav.help" defaultMessage="Help" description="Help button">
                        {(text) => (
                            <Button href="#" className='footerButton'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="nav.termsOfUse" defaultMessage="Terms" description="Terms button">
                        {(text) => (
                            <Button href="#" className='footerButton'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="nav.privaciPolicy" defaultMessage="Privacy" description="Privacy button">
                        {(text) => (
                            <Button href="#" className='footerButton'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                </Grid>
                <Grid item md={2} sm={12} xs={12} className='footerSocial'>
                    <Button href="#" className='footerSocialButton'>
                        <i className="fab fa-twitter"></i>
                    </Button>
                    <Button href="#" className='footerSocialButton'>
                        <i className="fab fa-facebook-f"></i>
                    </Button>
                    <Button href="#" className='footerSocialButton'>
                        <i className="fab fa-youtube"></i>
                    </Button>
                    <Button href="#" className='footerSocialButton'>
                        <i className="fab fa-google-plus-g"></i>
                    </Button>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;