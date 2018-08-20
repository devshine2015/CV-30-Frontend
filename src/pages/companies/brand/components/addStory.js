import React from 'react';
import { compose, pure, withState, withHandlers } from 'recompose';
import { Button, TextField, Switch as ToggleSwitch, FormLabel, FormGroup, IconButton, Icon } from '@material-ui/core';
import uuid from 'uuidv4';
import S3Uploader from 'react-s3-uploader';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { companyQuery } from '../../../../store/queries';
import { handleArticle, setFeedbackMessage } from '../../../../store/queries';

const AddStoryHOC = compose(
    withRouter,
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', ({ story }) => {
        if (!story)
            return { id: uuid() }
        else {
            // let { id, i18n, images, videos } = story;
            let { id, i18n, videos } = story;
            return {
                id,
                title: i18n && i18n[0] ? i18n[0].title : '',
                description: i18n && i18n[0] ? i18n[0].description : '',
                videoURL: videos && videos[0] ? videos[0].path : ''
            }
        }
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('isSaving', 'setIsSaving', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('popupOpen', 'setPopupOpen', false),
    withHandlers({
        toggleEditor: ({ popupOpen, setPopupOpen }) => () => {
            setPopupOpen(!popupOpen);
        },
        closeEditor: ({ setPopupOpen }) => () => {
            setPopupOpen(false);
        },
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
        saveChanges: ({ handleArticle, match: { params: { companyId, lang: language } }, formData, type, setPopupOpen, setFeedbackMessage }) => async () => {
            let article = {
                id: formData.id,
                title: formData.title,
                images: formData.images,
                description: formData.description,
                postAs: 'company',
                postingCompanyId: companyId
            };

            if (formData.videoURL) {
                article.videos = [
                    {
                        id: uuid(),
                        title: formData.videoURL,
                        sourceType: 'article',
                        path: formData.videoURL
                    }
                ];

            }

            let options = {
                articleId: formData.id,
                companyId,
                isAtOffice: type === 'company_officeLife',
                isMoreStories: type === 'company_moreStories'
            };

            try {
                await handleArticle({
                    variables: {
                        article,
                        options,
                        language

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
                setPopupOpen(false);
            }
            catch (err) {
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
                console.log(err);
            }
        },
        getSignedUrl: ({ formData, setFeedbackMessage }) => async (file, callback) => {
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
        onError: ({ setUploadError, setFeedbackMessage }) => error => {
            setUploadError(error);
            console.log(error);
            setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        onFinishUpload: props => data => {
            console.log(data);
            const { setIsSaving, setFeedbackMessage } = props;
            setIsSaving(false);
            setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'File uploaded successfully.'
                }
            });
        }
    }),
    pure
);

const AddStory = props => {

    const {
        popupOpen, toggleEditor, formData, handleFormChange, isVideoUrl, switchMediaType, story, saveChanges, cancel,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isSaving
    } = props;
    const { title, description, videoURL } = formData;
    return (
        <div className='addStoryWrapper'>
            {!story &&
                <span className='addStoryBtn' onClick={toggleEditor}>
                    + Add
                </span>
            }
            <div className={(popupOpen || story) ? 'newStoryForm open' : 'newStoryForm'}>
                <form noValidate autoComplete='off'>
                    <h4>Add article</h4>
                    <section className='infoSection'>
                        <TextField
                            name="title"
                            label="Article title"
                            placeholder="Title..."
                            className='textField'
                            fullWidth
                            onChange={handleFormChange}
                            value={title || ''}
                        />
                        <TextField
                            name="description"
                            label="Article body"
                            placeholder="Article body..."
                            className='textField'
                            multiline
                            rows={1}
                            rowsMax={10}
                            fullWidth
                            onChange={handleFormChange}
                            value={description || ''}
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
                                fullWidth
                                className='textField'
                                onChange={handleFormChange}
                                value={videoURL || ''}
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
                    <section className='footer'>
                        <IconButton className='cancelBtn' onClick={cancel} disabled={isSaving}>
                            <Icon>close</Icon>
                        </IconButton>
                        <IconButton className='submitBtn' onClick={saveChanges} disabled={isSaving}>
                            <Icon>done</Icon>
                        </IconButton>
                    </section>
                </form>
            </div>
        </div>
    )
};

export default AddStoryHOC(AddStory);