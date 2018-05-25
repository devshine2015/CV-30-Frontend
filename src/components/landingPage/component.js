import React from 'react';
import { Grid, Button, Hidden, IconButton, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedDate, FormattedNumber, FormattedPlural } from 'react-intl';

const LandingPage = ({ classes }) => {
    return (
        <div id="landingPage" className={classes.root}>
            <div className={classes.topNav}>
                <Grid container className={classes.navContainer}>
                    <Grid item md={1}>
                        <Link to="/" className={classes.brand}>
                            <img src="http://brandmark.io/logo-rank/random/pepsi.png" className={classes.roundedImage} alt="alupigus" />
                            Brand
                        </Link>
                    </Grid>
                    <Grid item>
                        <Button component={Link} to="/auth" variant="raised" type="button" className={classes.loginButton}>
                            Log in
                        </Button>
                        <Button component={Link} to={{
                            pathname: '/auth',
                            state: { step: 'register' }
                        }} variant="raised" color="primary" type="button" className={classes.registerButton}>
                            Sign up
                        </Button>
                    </Grid>
                </Grid>
                <Grid container className={classes.headlineContainer}>
                    <Grid item md={5} sm={12} xs={12}>
                        <h1 className={classes.heading1}>Introductory headline goes here</h1>
                        <p className={classes.paragraph}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                             </p>
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
                            Title for feature
                        </h2>
                        <p className={classes.featureText}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                        </p>
                    </Grid>

                </Grid>

                <Grid container className={[classes.featureRow, classes.featureRowReverse].join(' ')}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <h2 className={classes.featureHeading}>
                            Title for feature
                        </h2>
                        <p className={classes.featureText}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                        </p>
                    </Grid>

                </Grid>

                <Grid container className={classes.featureRow}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <h2 className={classes.featureHeading}>
                            Title for feature
                        </h2>
                        <p className={classes.featureText}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                        </p>
                    </Grid>

                </Grid>

                <Grid container className={[classes.featureRow, classes.featureRowReverse].join(' ')}>
                    <Grid item md={5} sm={12} xs={12} className={classes.featureImageContainer}>
                        <div className={classes.featureImage}>
                        </div>
                    </Grid>

                    <Grid item md={5} sm={11} xs={11} className={classes.featureTexts}>
                        <h2 className={classes.featureHeading}>
                            Title for feature
                        </h2>
                        <p className={classes.featureText}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                        </p>
                    </Grid>

                </Grid>
            </div>

            <div className={classes.storiesContainer}>
                <Grid container>
                    <Grid item md={6} sm={6} xs={12} className={classes.storiesSliderContainer}>
                        <h1 className={classes.storiesSliderTitle}>User stories</h1>
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
                        <h2 className={classes.slideTitle}>Title for feature</h2>
                        <p className={classes.slideText}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                        </p>
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
                        <h1 className={classes.heading1}>
                            Creaza un cont
                        </h1>
                        <p className={classes.paragraph}>
                            Lorem ipsum dolor sit amet, oratio minimum cum ex, rebum error incorrupte mei te. Has hinc consulatu cu. Pro causae cetero eleifend no,
                            altera feugait eam et, eius aperiam sed id. Mei ei putent putant, sanctus gubergren cu sea. Qui ut agam labores accusamus, atqui pertinax
                            intellegat ei sed, te vel assum molestiae. Feugiat repudiandae ad sed.
                        </p>
                        <Button component={Link} to={{
                            pathname: '/auth',
                            state: { step: 'register' }
                        }} variant="raised" color="primary" type="button" className={classes.footerSignupButton}>
                            Sign up
                        </Button>
                    </Grid>
                </Grid>
                <Grid container className={classes.footerLinks}>
                    <Grid item md={2} sm={12} xs={12} className={classes.footerCopyright}>
                        &copy; 2018 CV30. All rights reserved.
                    </Grid>
                    <Grid item md={8} sm={12} xs={12} className={classes.footerMenu}>
                        <Button href="#" className={classes.footerButton}>
                            Contact
                        </Button>
                        <Button href="#" className={classes.footerButton}>
                            Help
                        </Button>
                        <Button href="#" className={classes.footerButton}>
                            Terms of use
                        </Button>
                        <Button href="#" className={classes.footerButton}>
                            Privacy policy
                        </Button>
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