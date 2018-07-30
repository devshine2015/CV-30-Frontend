import React from 'react';
import { Modal, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Icon, IconButton, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import S3Uploader from 'react-s3-uploader';

import { handleArticle, landingPage, setFeedbackMessage } from '../../../store/queries';

const ArticlePopUpHOC = compose(
    withRouter,
    graphql(handleArticle, {
        name: 'handleArticle'
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', props => {
        return {
            id: uuid()
        };
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('isSaving', 'setIsSaving', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        saveArticle: ({ formData, handleArticle, setIsSaving, isSaving, match, onClose, setFeedbackMessage }) => async () => {
            // if (isSaving)
            //     return false;

            // setIsSaving(true);
            console.log(formData);

            // try {
            //     await handleArticle({
            //         variables: {
            //             language: match.params.lang,
            //             article,
            //             options
            //         },
            //         refetchQueries: [refetchQuery]
            //     });
            //     onClose();
            // await setFeedbackMessage({
            //     variables: {
            //         status: 'success',
            //         message: 'Changes saved successfully.'
            //     }
            // });
            // }
            // catch (err) {
            //     console.log(err);
            //     setIsSaving(true);
            // await setFeedbackMessage({
            //     variables: {
            //         status: 'error',
            //         message: err.message
            //     }
            // });

            // }
        },
        getSignedUrl: ({ formData }) => async (file, callback) => {
            const params = {
                fileName: file.name,
                contentType: file.type,
                id: formData.id,
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
        onUploadStart: ({ setIsSaving, formData, setFormData, match }) => (file, next) => {
            let size = file.size;
            if (size > 1024 * 1024) {
                alert('File is too big!');
            } else {
                let newFormData = Object.assign({}, formData);

                newFormData.images = [{
                    id: uuid(),
                    title: file.name,
                    sourceType: 'article',
                    source: formData.id,
                    path: `/articles/${formData.id}/${file.name}`
                }];
                setFormData(newFormData);
                setIsSaving(true);
                next(file);
            }
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
        onFinishUpload: ({ setIsSaving, setFeedbackMessage }) => async data => {
            setIsSaving(false);
            await setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'File uploaded successfully.'
                }
            });
        },
    }),
    pure
)

const ArticlePopUp = ({
    open, onClose,
    getSignedUrl, onProgress, onError, onFinishUpload, onUploadStart, isSaving, saveArticle,
    formData: { title, description, videoURL },
    handleFormChange, isVideoUrl, switchMediaType
}) => {
    return (
        <Modal
            open={open}
            classes={{
                root: 'modalRoot'
            }}
            onClose={onClose}
        >
            <div className='storyEditPaper'>
                <div className='popupBody'>
                    <div className='newArticleForm'>
                        <h4>Add article</h4>
                        <section className='infoSection'>
                            <TextField
                                name="title"
                                label="Article title"
                                placeholder="Title..."
                                className='textField'
                                onChange={handleFormChange}
                                value={title || ''}
                                fullWidth
                            />
                            <TextField
                                name="description"
                                label="Article body"
                                placeholder="Article body..."
                                className='textField'
                                multiline
                                rows={1}
                                rowsMax={10}
                                onChange={handleFormChange}
                                value={description || ''}
                                fullWidth
                            />
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

                        </section>
                        <section className='mediaUpload'>
                            {isVideoUrl ?
                                <TextField
                                    name="videoURL"
                                    label="Add video URL"
                                    placeholder="Video URL..."
                                    className='textField'
                                    onChange={handleFormChange}
                                    value={videoURL || ''}
                                    fullWidth
                                /> :
                                <label htmlFor="uploadArticleImage">
                                    <S3Uploader
                                        id="uploadArticleImage"
                                        name="uploadArticleImage"
                                        className='hiddenInput'
                                        getSignedUrl={getSignedUrl}
                                        accept="image/*"
                                        preprocess={onUploadStart}
                                        onProgress={onProgress}
                                        onError={onError}
                                        onFinish={onFinishUpload}
                                        uploadRequestHeaders={{
                                            'x-amz-acl': 'public-read'
                                        }}
                                    />
                                    <Button component='span' className='badgeRoot' disabled={isSaving}>
                                        Upload
                        </Button>
                                </label>
                            }
                        </section>
                        <section className='editControls'>
                            <IconButton className='cancelBtn' onClick={onClose} disabled={isSaving}>
                                <Icon>close</Icon>
                            </IconButton>
                            <IconButton className='submitBtn' onClick={saveArticle} disabled={isSaving}>
                                <Icon>done</Icon>
                            </IconButton>
                        </section>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ArticlePopUpHOC(ArticlePopUp);