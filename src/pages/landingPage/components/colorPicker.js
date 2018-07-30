import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { availableColors } from '../../../constants/headerBackgrounds';
import { landingPage, handleLandingPage, setFeedbackMessage } from '../../../store/queries';

const ColorPickerHOC = compose(
    withRouter,
    graphql(handleLandingPage, { name: 'handleLandingPage' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('fileParams', 'setFileParams', {}),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        setBackgroundColor: ({ handleLandingPage, setFeedbackMessage, match: { params: { lang: language } }, type }) => async color => {
            let details = {};
            switch (type) {
                case 'header':
                    details = {
                        coverBackground: color ? color.style : 'none'
                    };
                    break;
                case 'footer':
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
        getSignedUrl: ({ match: { params: { companyId } }, setFileParams, type }) => async (file, callback) => {
            let fileName;
            switch (type) {
                case 'header':
                    fileName = `headerCover.${file.type.replace('image/', '')}`;
                    break;
                case 'footer':
                    fileName = `footerCover.${file.type.replace('image/', '')}`;
                    break;
            }

            const params = {
                fileName,
                contentType: file.type,
                type: 'landingPage_cover'
            };

            setFileParams(params);

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error || error.message
                    }
                });
            }
        },
        onUploadStart: ({ setIsUploading }) => (file, next) => {
            setIsUploading(true);
            next(file);
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        onFinish: ({ setFeedbackMessage, setIsUploading, handleLandingPage, refetchBgImage, fileParams: { contentType }, match: { params: { lang: language } }, type }) => async () => {
            let details = {};
            switch (type) {
                case 'header':
                    details = {
                        hasCover: true,
                        coverContentType: contentType.replace('image/', '')
                    };
                    break;
                case 'footer':

                    details = {
                        hasFooterCover: true,
                        footerCoverContentType: contentType.replace('image/', '')
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

const ColorPicker = (props) => {
    const { colorPickerAnchor, onClose,
        setBackgroundColor,
        activeTab, handleTabChange,
        getSignedUrl, onUploadStart, onProgress, onError, onFinish,
    } = props;
    return (
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

                <label htmlFor="uploadCoverPhoto">
                    <S3Uploader
                        id="uploadCoverPhoto"
                        name="uploadCoverPhoto"
                        className='hiddenInput'
                        getSignedUrl={getSignedUrl}
                        accept="image/*"
                        preprocess={onUploadStart}
                        onProgress={onProgress}
                        onError={onError}
                        onFinish={onFinish}
                        uploadRequestHeaders={{
                            'x-amz-acl': 'public-read',
                        }}
                    />
                    <Button component='span' size='small' className='picUploadButton'>
                        Upload picture
                    </Button>
                </label>


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
}

export default ColorPickerHOC(ColorPicker);