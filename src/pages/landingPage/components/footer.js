import React from 'react';
import { Grid, Button, Hidden, IconButton, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import ColorPicker from './colorPicker';
import { s3BucketURL } from '../../../constants/s3';
import { defaultHeaderOverlay } from '../../../constants/utils';
import { handleLandingPage, landingPage, setFeedbackMessage } from '../../../store/queries';
import Feedback from '../../../components/Feedback';

const FooterHOC = compose(
    graphql(handleLandingPage, { name: 'handleLandingPage' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('footerMessage', 'setFooterMessage', props => {
        try {
            let { landingPageQuery: { landingPage: { i18n } } } = props;
            return (i18n && i18n[0] && i18n[0].footerMessage) ? i18n[0].footerMessage : '';
        }
        catch (err) {
            return '';
        }
    }),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        updateFooterMessage: ({ setFooterMessage }) => text => {
            setFooterMessage(text)
        },
        submitFooterMessage: ({ footerMessage, handleLandingPage, match: { params: { lang: language } }, setFeedbackMessage }) => async () => {
            try {
                await handleLandingPage({
                    variables: {
                        language,
                        details: {
                            footerMessage
                        }
                    },
                    refetchQueries: [{
                        query: landingPage,
                        fetchPolicy: 'network-only',
                        name: 'landingPage',
                        variables: {
                            language
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(JSON.stringify(err));
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        refetchBgImage: ({ setForceCoverRender }) => () => setForceCoverRender(Date.now()),
        closeFeedback: ({ setFeedbackMessage }) => () => setFeedbackMessage(null)

    }),
    pure
);

const Footer = props => {
    const {
        editMode,
        footerMessage, updateFooterMessage, submitFooterMessage,
        toggleColorPicker, colorPickerAnchor, closeColorPicker, refetchBgImage, forceCoverRender,
        landingPageQuery: { landingPage },
        match: { params: { lang } }
    } = props;

    const { footerCoverBackground, footerCoverPath } = landingPage || {};

    let footerStyle = null;

    if (footerCoverBackground) {
        footerStyle = { background: footerCoverBackground }
    } else {
        footerStyle = { background: defaultHeaderOverlay }
    }

    if (footerCoverPath) {
        let newCover = `${s3BucketURL}${footerCoverPath}?${forceCoverRender}`;
        footerStyle.background += `, url(${newCover})`;
    }

    return (
        <footer className='footer' style={footerStyle}>
            {
                editMode &&
                <React.Fragment>
                    <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                        <span className='text'>Change Background</span>
                        <Icon className='icon'>brush</Icon>
                    </Button>
                    <ColorPicker
                        colorPickerAnchor={colorPickerAnchor}
                        onClose={closeColorPicker}
                        refetchBgImage={refetchBgImage}
                        type='lp_footer'
                    />
                </React.Fragment>
            }
            <Grid container className='footerContainer'>
                <Hidden mdDown>
                    <Grid item md={5} sm={12} xs={12}></Grid>
                </Hidden>
                <Grid item md={5} sm={12} xs={12}>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FroalaEditor
                                    config={{
                                        placeholderText: 'This is where the company footer message should be',
                                        iconsTemplate: 'font_awesome_5',
                                        toolbarInline: true,
                                        charCounterCount: false,
                                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                    }}
                                    model={footerMessage}
                                    onModelChange={updateFooterMessage}
                                />
                                <IconButton className='submitBtn' onClick={submitFooterMessage}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                            : <div dangerouslySetInnerHTML={{ __html: footerMessage }} />
                    }

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

export default FooterHOC(Footer);