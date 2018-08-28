import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { availableColors } from '../../../constants/headerBackgrounds';
import { landingPage, handleLandingPage, setFeedbackMessage } from '../../../store/queries';
import ImageUploader from '../../../components/imageUploader';

const ColorPickerHOC = compose(
    withRouter,
    graphql(handleLandingPage, { name: 'handleLandingPage' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('fileParams', 'setFileParams', {}),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
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
            }
            try {
                await handleLandingPage({
                    variables: {
                        language,
                        details
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
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
        handleError: ({ setFeedbackMessage }) => async error => {
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: JSON.stringify(error, null, 2)
                }
            });
        },
        handleSuccess: ({
            setFeedbackMessage, setIsUploading,
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
            }

            try {
                await handleLandingPage({
                    variables: {
                        language,
                        details
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

            setIsUploading(false);
            refetchBgImage();
        }
    }),
    pure
);

const ColorPicker = ({
    colorPickerAnchor, onClose,
    setBackgroundColor,
    activeTab, handleTabChange,
    openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess, type
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
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                >
                    <Tab label="Colors" value='colors' />
                    <Tab label="Patterns" value='patterns' />
                </Tabs>

                <Button size='small' className='picUploadButton' onClick={openImageUpload}>
                    Upload picture
                </Button>
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
                        <pre>Patterns</pre>
                    </div>
                }
            </div>
        </Popover>
    );


export default ColorPickerHOC(ColorPicker);