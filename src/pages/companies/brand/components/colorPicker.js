import React from 'react';
import { Popover, Button, Tab, Tabs } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { availableColors } from '../../../../constants/headerBackgrounds';
import { handleCompany, companyQuery, setFeedbackMessage } from '../../../../store/queries';

const ColorPickerHOC = compose(
    withRouter,
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('activeTab', 'setActiveTab', 'colors'),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('fileParams', 'setFileParams', {}),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        setBackgroundColor: ({ handleCompany, match: { params: { lang: language, companyId } }, setFeedbackMessage }) => async color => {
            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: companyId,
                            coverBackground: color.style
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language,
                            id: companyId
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
        getSignedUrl: ({ match: { params: { companyId } }, setFileParams, setFeedbackMessage }) => async (file, callback) => {
            const params = {
                fileName: `cover.${file.type.replace('image/', '')}`,
                contentType: file.type,
                id: companyId,
                type: 'company_cover'
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
        onFinish: ({
            setIsUploading, handleCompany, refetchBgImage,
            fileParams: { contentType },
            match: { params: { companyId, lang: language } },
            setFeedbackMessage
        }) => async () => {
            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: companyId,
                            hasCover: true,
                            coverContentType: contentType.replace('image/', '')
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language,
                            id: companyId
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