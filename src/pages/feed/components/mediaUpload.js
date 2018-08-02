import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Popover, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Button } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import uuid from 'uuidv4';

import { setFeedbackMessage } from '../../../store/queries';

const MediaUploadPopUpHOC = compose(
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('videoURL', 'setVideoURL', ''),
    withState('isSaving', 'setIsSaving', false),
    withState('imgParams', 'setImgParams', null),
    withHandlers({
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        handleFormChange: ({ setVideoURL }) => url => setVideoURL(url),
        handleKeyPress: ({ onClose, videoURL }) => event => {
            if (event.key !== 'Enter')
                return;

            onClose({
                video: {
                    id: uuid(),
                    title: videoURL,
                    sourceType: 'article',
                    path: videoURL

                }
            });
        },
        getSignedUrl: ({ postId, setFeedbackMessage }) => async (file, callback) => {
            const params = {
                fileName: file.name,
                contentType: file.type,
                id: postId,
                type: 'article'
            };

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
        onUploadStart: ({ setIsSaving, setImgParams, postId }) => (file, next) => {
            let size = file.size;
            if (size > 1024 * 1024) {
                alert('File is too big!');
            } else {
                setImgParams({
                    id: uuid(),
                    title: file.name,
                    sourceType: 'article',
                    source: postId,
                    path: `/articles/${postId}/${file.name}`
                });
                setIsSaving(true);
                next(file);
            }
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
        onFinishUpload: ({ setIsSaving, onClose, setFeedbackMessage, imgParams, videoURL }) => async data => {
            await setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'Changes saved successfully.'
                }
            });
            setIsSaving(false);
            onClose({ imgParams });
        },
    }),
    pure
);

const MediaUploadPopUp = ({
    anchor, onClose,
    isVideoUrl, switchMediaType,
    getSignedUrl, onUploadStart, onError, onFinishUpload,
    videoURL, handleFormChange, handleKeyPress, isSaving
}) => (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            classes={{
                paper: 'mediaUploadPaper'
            }}
        >
            <div className='mediaUploadPopup'>
                <FormGroup row className='mediaToggle'>
                    <span className='mediaToggleLabel'>Upload visuals</span>
                    <FormLabel className={!isVideoUrl ? 'active' : ''}>Photo</FormLabel>
                    <ToggleSwitch
                        checked={isVideoUrl}
                        onChange={switchMediaType}
                        classes={{
                            switchBase: 'colorSwitchBase',
                            checked: 'colorChecked',
                            bar: 'colorBar',
                        }}
                        color="primary" />
                    <FormLabel className={isVideoUrl ? 'active' : ''}>Video Url</FormLabel>
                </FormGroup>
                <section className='mediaUpload'>
                    {isVideoUrl ?
                        <TextField
                            name="videoURL"
                            label="Add video URL"
                            placeholder="Video URL..."
                            className='textField'
                            onChange={event => handleFormChange(event.target.value)}
                            onKeyPress={event => handleKeyPress(event)}
                            value={videoURL || ''}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: 'textFieldInput',
                                    underline: 'textFieldUnderline'
                                },
                            }}
                            InputLabelProps={{
                                className: 'textFieldLabel'
                            }}
                        /> :
                        <label htmlFor="uploadArticleImage">
                            <S3Uploader
                                id="uploadArticleImage"
                                name="uploadArticleImage"
                                className='hiddenInput'
                                getSignedUrl={getSignedUrl}
                                accept="image/*"
                                preprocess={onUploadStart}
                                onError={onError}
                                onFinish={onFinishUpload}
                                uploadRequestHeaders={{
                                    'x-amz-acl': 'public-read'
                                }}
                            />
                            <Button component='span' className='imgUpload' disabled={isSaving}>
                                Upload
                            </Button>
                        </label>
                    }
                </section>
            </div>
        </Popover>
    );

export default MediaUploadPopUpHOC(MediaUploadPopUp);