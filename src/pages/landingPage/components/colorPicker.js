import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'
import { availableColors } from '../../../constants/headerBackgrounds';
import { handleLandingPage, setFeedbackMessage } from '../../../store/queries';
import { landingPageRefetch } from '../../../store/refetch';
import ImageUploader from '../../../components/imageUploader';

const ColorPickerHOC = compose(
    withRouter,
    graphql(handleLandingPage, { name: 'handleLandingPage' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        activeTab: 'colors',
        imageUploadOpen: false
    }),
    withHandlers({
        handleTabChange: ({ state, setState }) => (_, activeTab) => setState({ ...state, activeTab }) ,
        setBackgroundColor: ({ handleLandingPage, setFeedbackMessage, match: { params: { lang: language } }, type }) => async color => {
            let details = {};
            switch (type) {
                case 'lp_header':
                    details = {
                        coverBackground: color ? color.style : 'none'
                    };
                    break;
                case 'lp_footer':
                    details = {
                        footerCoverBackground: color ? color.style : 'none'
                    };
                    break;
                default:
                    break;
            }
            try {
                await handleLandingPage({
                    variables: {
                        language,
                        details
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
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: JSON.stringify(error, null, 2)
                }
            });
        },
        handleSuccess: ({
            setFeedbackMessage, state, setState,
            handleLandingPage, refetchBgImage,
            match: { params: { lang: language } }, type
        }) => async ({ path, filename }) => {
            let details = {};
            let coverPath = path ? path : `/landingPage/${filename}`;
            switch (type) {
                case 'lp_header':
                    details = {
                        coverPath
                    };
                    break;
                case 'lp_footer':
                    details = {
                        footerCoverPath: coverPath
                    };
                    break;
                default:
                    break;
            }

            try {
                await handleLandingPage({
                    variables: {
                        language,
                        details
                    },
                    refetchQueries: [
                        landingPageRefetch(language)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'File uploaded successfully.'
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

            // setState({ ...state, isUploading: false });
            refetchBgImage();
        }
    }),
    pure
);

const ColorPicker = ({
    state: {
        activeTab,
        imageUploadOpen
    },
    colorPickerAnchor, onClose,
    setBackgroundColor,
    handleTabChange,
    openImageUpload, closeImageUpload, handleError, handleSuccess, type
}) => (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={Boolean(colorPickerAnchor)}
            anchorEl={colorPickerAnchor}
            onClose={onClose}
            classes={{
                paper: 'colorPickerPaper'
            }}
        >
            <div className='popupHeader'>
                <FormattedMessage id="company.brand.patterns" defaultMessage="Colors\nPatterns" description="Colors Patterns">
                    {(text) => (
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                        >
                            <Tab label={text.split("\n")[0]} value='colors' />
                            <Tab label={text.split("\n")[1]} value='patterns' />
                        </Tabs>
                    )}
                </FormattedMessage>

                <FormattedMessage id="company.brand.picUpload" defaultMessage="Upload picture" description="Upload picture">
                    {(text) => (
                        <Button size='small' className='picUploadButton' onClick={openImageUpload}>
                            {text}
                        </Button>
                    )}
                </FormattedMessage>
                <ImageUploader
                    type={type}
                    open={imageUploadOpen}
                    onClose={closeImageUpload}
                    onError={handleError}
                    onSuccess={handleSuccess}
                />
            </div>

            <div className='popupBody'>
                {activeTab === 'colors' &&
                    <div className='pickerContainer colors'>
                        {
                            availableColors.map((color, index) =>
                                <div
                                    className='color'
                                    onClick={() => setBackgroundColor(color)}
                                    style={{ background: color.style }}
                                    key={`colorPicker-${index}`}
                                />)
                        }
                        <div
                            className='color none'
                            onClick={() => setBackgroundColor()}
                            key='colorPicker-none'
                        >None</div>
                    </div>
                }
                {
                    activeTab === 'patterns' &&
                    <div className='pickerContainer patterns'>
                        <FormattedMessage id="company.brand.patterns" defaultMessage="Patterns" description="Patterns">
                            {(text) => (
                                <pre>{text}</pre>
                            )}
                        </FormattedMessage>
                    </div>
                }
            </div>
        </Popover>
    );


export default ColorPickerHOC(ColorPicker);