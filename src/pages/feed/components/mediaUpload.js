import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Popover, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Button } from '@material-ui/core';
import uuid from 'uuidv4';

import { setFeedbackMessage } from '../../../store/queries';
import ImageUploader from '../../../components/imageUploader';
import { articlesFolder } from '../../../constants/s3';

const MediaUploadPopUpHOC = compose(
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('videoURL', 'setVideoURL', ''),
    withState('isSaving', 'setIsSaving', false),
    withState('imgParams', 'setImgParams', null),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        handleFormChange: ({ setVideoURL }) => url => setVideoURL(url),
        handleKeyPress: ({ onClose, videoURL, setVideoURL }) => event => {
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
            setVideoURL('');
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
        handleSuccess: ({ postId, onClose }) => file => {
            let { path, filename } = file;
            if (!path) {
                path = `/${articlesFolder}/${postId}/${filename}`
            }

            onClose({
                imgParams: {
                    id: uuid(),
                    sourceType: 'article',
                    path
                }
            });
        },
    }),
    pure
);

const MediaUploadPopUp = ({
    anchor, onClose, postId,
    isVideoUrl, switchMediaType,
    openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess,
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
                        <Button className='imgUpload' disabled={isSaving} onClick={openImageUpload}>
                            Upload
                        </Button>

                    }
                </section>
            </div>
            <ImageUploader
                type='article'
                open={imageUploadOpen}
                onClose={closeImageUpload}
                onError={handleError}
                onSuccess={handleSuccess}
                id={postId}
            />
        </Popover>
    );

export default MediaUploadPopUpHOC(MediaUploadPopUp);