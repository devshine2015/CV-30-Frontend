import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Popover, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Button } from '@material-ui/core';
import uuid from 'uuidv4';
import { FormattedMessage }  from 'react-intl'
import { setFeedbackMessage } from '../../../store/queries';
import ImageUploader from '../../../components/imageUploader';
import { articlesFolder } from '../../../constants/s3';

const MediaUploadPopUpHOC = compose(
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        isVideoUrl: true,
        videoURL: '',
        isSaving: false,
        imageUploadOpen: false
    }),
    withHandlers({
        switchMediaType: ({ state, setState }) => () => setState({ ...state, isVideoUrl: !state.isVideoUrl }),
        handleFormChange: ({ state, setState }) => videoURL => setState({ ...state, videoURL }),
        handleKeyPress: ({ onClose, state, setState }) => event => {
            if (event.key !== 'Enter')
                return;
            onClose({
                video: {
                    id: uuid(),
                    title: state.videoURL,
                    sourceType: 'article',
                    path: state.videoURL
                }
            });
            setState({ ...state, videoURL: '' })
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
    state: {
        isVideoUrl,
        videoURL,
        isSaving,
        imageUploadOpen
    },
    anchor, onClose, postId,
    switchMediaType,
    openImageUpload, closeImageUpload, handleError, handleSuccess,
    handleFormChange, handleKeyPress
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
                    <FormattedMessage id="feed.mediaToggleLabel" defaultMessage="Upload visuals" description="Upload visuals">
                        {(text) => (
                            <span className='mediaToggleLabel'>{text}</span>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="feed.photo" defaultMessage="Photo" description="Photo">
                        {(text) => (
                            <FormLabel className={!isVideoUrl ? 'active' : ''}>{text}</FormLabel>
                        )}
                    </FormattedMessage>
                    
                    <ToggleSwitch
                        checked={isVideoUrl}
                        onChange={switchMediaType}
                        classes={{
                            switchBase: 'colorSwitchBase',
                            checked: 'colorChecked',
                            bar: 'colorBar',
                        }}
                        color="primary" />
                    <FormattedMessage id="feed.videoUrl" defaultMessage="Video Url" description="Video Url">
                        {(text) => (
                            <FormLabel className={isVideoUrl ? 'active' : ''}>{text}</FormLabel>
                        )}
                    </FormattedMessage>
                    
                </FormGroup>
                <section className='mediaUpload'>
                    {isVideoUrl ?
                        <FormattedMessage id="feed.addVideoUrl" defaultMessage="Add video URL" description="Add video URL">
                                {(text) => (
                                    <TextField
                                        name="videoURL"
                                        label={text.split("\n")[0]}
                                        placeholder={text.split("\n")[1]}
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
                                    /> 
                                )}
                        </FormattedMessage>
                        :
                        <FormattedMessage id="feed.imageUpload" defaultMessage="Upload" description="Upload">
                            {(text) => (
                                <Button className='imgUpload' disabled={isSaving} onClick={openImageUpload}>
                                    {text}
                                </Button>
                            )}
                        </FormattedMessage>
                        

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