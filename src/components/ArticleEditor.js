import React from 'react';
import { Button, TextField, Switch as ToggleSwitch, FormLabel, FormGroup, IconButton, Icon } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { handleArticle, currentProfileQuery, companyQuery, queryTeam } from '../store/queries';
import { graphql } from 'react-apollo';
import uuid from 'uuid/v4';
import S3Uploader from 'react-s3-uploader';
import { withRouter } from 'react-router-dom';

const ArticleEditorHOC = compose(
    withRouter,
    graphql(handleArticle, {
        name: 'handleArticle'
    }),
    withState('formData', 'setFormData', props => {
        return {
            id: uuid()
        };
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('isSaving', 'setIsSaving', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
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
        saveArticle: ({ formData, handleArticle, setIsSaving, isSaving, match, type, onClose }) => async () => {
            if (isSaving)
                return false;

            setIsSaving(true);

            let refetchQuery = {};

            switch (type) {
                case 'profile_isFeatured':
                    refetchQuery = {
                        query: currentProfileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: match.params.lang
                        }
                    };
                    break;
                case 'profile_isAboutMe':
                    refetchQuery = {
                        query: currentProfileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: match.params.lang
                        }
                    };
                    break;
                case 'company_featured':
                    refetchQuery = {
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: match.params.lang,
                            id: match.params.companyId
                        }
                    };
                    break;
                case 'job_officeLife':
                    refetchQuery = {
                        query: queryTeam,
                        fetchPolicy: 'network-only',
                        name: 'queryTeam',
                        variables: {
                            language: match.params.lang,
                            id: match.params.teamId
                        }
                    };
                    break;
                default:
                    return false;
            }
            let article = {
                id: formData.id,
                title: formData.title,
                images: formData.images,
                description: formData.description,
                isFeatured: type === 'profile_isFeatured',
                isAboutMe: type === 'profile_isAboutMe'
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
                isFeatured: type === 'company_featured' || type === 'job_officeLife',

            };

            if (match.params.companyId)
                options.companyId = match.params.companyId;
            if (type === 'job_officeLife')
                options.teamId = match.params.teamId;

            try {
                await handleArticle({
                    variables: {
                        language: match.params.lang,
                        article,
                        options
                    },
                    refetchQueries: [refetchQuery]
                });
                onClose();
            }
            catch (err) {
                console.log(err);
                setIsSaving(true);

            }
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
                callback(error)
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
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: props => data => {
            console.log(data);
            const { setIsSaving, } = props;
            setIsSaving(false);
        },
    }),
    pure
)

const ArticleEditor = props => {
    const {
        handleFormChange, isVideoUrl, switchMediaType, formData,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload,
        onClose, saveArticle, isSaving
    } = props;
    const { title, description, videoURL } = formData;

    return (
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
    );
};

export default ArticleEditorHOC(ArticleEditor);