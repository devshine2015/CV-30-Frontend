import React from 'react';
import { Grid, Hidden, IconButton, Icon, Button, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl'
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
import { handleLandingPage, setFeedbackMessage } from '../../../store/queries';
import { landingPageRefetch } from '../../../store/refetch';

const HeaderHOC = compose(
    graphql(handleLandingPage, { name: 'handleLandingPage' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ landingPageQuery: { landingPage: { i18n } } }) => {
        return {
            headline: (i18n && i18n[0] && i18n[0].headline) || '',
            colorPickerAnchor: null,
            forceCoverRender: 0
        }
    }),
    withHandlers({
        toggleColorPicker: ({ state, setState }) => (event) => setState({ ...state, colorPickerAnchor: event.target }),
        closeColorPicker: ({ state, setState }) => () => setState({ ...state, colorPickerAnchor: null }),
        updateHeadline: ({ state, setState }) => headline => setState({ ...state, headline }),
        submitHeadline: ({ state: { headline }, handleLandingPage, match: { params: { lang: language } }, setFeedbackMessage }) => async () => {
            try {
                await handleLandingPage({
                    variables: {
                        language,
                        details: {
                            headline
                        }
                    },
                    refetchQueries: [
                        landingPageRefetch(language)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        refetchBgImage: ({ state, setState }) => () => setState({ ...state, forceCoverRender: Date.now() }),
        closeFeedback: ({ setFeedbackMessage }) => () => setFeedbackMessage(null)
    }),
    pure
);

const Header = props => {
    const {
        state: { headline, colorPickerAnchor, forceCoverRender },
        switchEditMode, editMode, currentUserQuery: { auth },
        updateHeadline, submitHeadline,
        toggleColorPicker, closeColorPicker, refetchBgImage,
        landingPageQuery: { landingPage },
    } = props;

    const { coverBackground, coverPath } = landingPage || {};
    const isEditAllowed = (auth && auth.currentUser && auth.currentUser.god) || false;
    
    let headerStyle = null;

    if (coverBackground) {
        headerStyle = { background: coverBackground }
    } else {
        headerStyle = { background: defaultHeaderOverlay }
    }

    if (coverPath) {
        let newCover = `${s3BucketURL}${coverPath}?${forceCoverRender}`;
        headerStyle.background += `, url(${newCover})`;
    }
    return (
        <div className='header' style={headerStyle}>
            {
                isEditAllowed &&
                <FormGroup row className='editToggle'>
                    <FormattedMessage id="toggle.view" defaultMessage="View" description="View">
                        {(text) => (
                            <FormLabel className={!editMode ? 'active' : ''}>{text}</FormLabel>
                        )}
                    </FormattedMessage>
                    
                    <ToggleSwitch checked={editMode} onChange={switchEditMode}
                        classes={{
                            switchBase: 'colorSwitchBase',
                            checked: 'colorChecked',
                            bar: 'colorBar',
                        }}
                        color="primary" />
                    <FormattedMessage id="toggle.edit" defaultMessage="Edit" description="Edit">
                        {(text) => (
                            <FormLabel className={editMode ? 'active' : ''}>{text}</FormLabel>
                        )}
                    </FormattedMessage>
                    
                </FormGroup>
            }
            {
                editMode &&
                <React.Fragment>
                    <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                        <FormattedMessage id="company.brand.changeBackground" defaultMessage="Change Background" description="Change Background">
                            {(text) => (
                                <span className='text'>{text}</span>
                            )}
                        </FormattedMessage>
                       
                        <Icon className='icon'>brush</Icon>
                    </Button>
                    <ColorPicker
                        colorPickerAnchor={colorPickerAnchor}
                        onClose={closeColorPicker}
                        refetchBgImage={refetchBgImage}
                        type='lp_header'
                    />
                </React.Fragment>
            }
            <Grid container className='headlineContainer'>
                <Grid item md={5} sm={12} xs={12}>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FroalaEditor
                                    config={{
                                        placeholderText: 'This is where the company headline should be',
                                        iconsTemplate: 'font_awesome_5',
                                        toolbarInline: true,
                                        charCounterCount: false,
                                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                    }}
                                    model={headline}
                                    onModelChange={updateHeadline}
                                />
                                <IconButton className='submitBtn' onClick={submitHeadline}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                            : <span dangerouslySetInnerHTML={{ __html: headline }} />
                    }
                </Grid>
                <Hidden mdDown>
                    <Grid item md={5} sm={12} xs={12}></Grid>
                </Hidden>
            </Grid>
        </div>
    );
};

export default HeaderHOC(Header);