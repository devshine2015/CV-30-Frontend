import React from 'react';
import { Grid, TextField, Button, FormGroup, FormLabel, Switch as ToggleSwitch, } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { compose, withState, withHandlers, pure } from 'recompose';
import S3Uploader from 'react-s3-uploader';
import uuid from 'uuidv4';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import { handleArticle, setFeedbackMessage } from '../../../../store/queries';
import { articleRefetch } from '../../../../store/refetch';
import TagsInput from '../../../../components/TagsInput';

const ArticleEditHOC = compose(
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ getArticle: { article: { title, description, tags } } }) => ({
        title,
        description,
        tags,
        isVideoUrl: true,
        isSaving: false
    })),
    withHandlers({
        setTags: ({ state, setState }) => tags => setState({ ...state, tags }),
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({ ...state, [name]: value });
        },
        updateDescription: ({ state, setState }) => text => setState({ ...state, 'description': text }),
        switchMediaType: ({ state, setState }) => text => setState({ ...state, 'isVideoUrl': !state.isVideoUrl }),
        saveArticle: props => async () => {
            const { handleArticle, state, setState, match, setFeedbackMessage } = props;
            const { formData: { title, description, videoURL, images, tags } } = state;
            const article = {
                id: match.params.articleId,
                title,
                description,
                images,
                tags
            };

            if (videoURL) {
                article.videos = [
                    {
                        id: uuid(),
                        title: videoURL,
                        sourceType: 'article',
                        path: videoURL
                    }
                ];
            }

            try {
                await handleArticle({
                    variables: {
                        language: match.params.lang,
                        article
                    },
                    refetchQueries: [
                        articleRefetch(match.params.articleId, match.params.lang)
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
                setState({ ...state, isSaving: true });
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        getSignedUrl: ({ state: { formData: { id } }, setFeedbackMessage }) => async (file, callback) => {
            const params = {
                fileName: file.name,
                contentType: file.type,
                id,
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
        onUploadStart: ({ state, setState }) => (file, next) => {
            let size = file.size;
            if (size > 1024 * 1024) {
                alert('File is too big!');
            } else {
                let newFormData = Object.assign({}, state.formData);

                newFormData.images = [{
                    id: uuid(),
                    title: file.name,
                    sourceType: 'article',
                    source: state.formData.id,
                    path: `/articles/${state.formData.id}/${file.name}`
                }];
                setState({ ...state, formData: newFormData, isSaving: true });
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
        onFinishUpload: ({ state, setState, setFeedbackMessage }) => async data => {
            setState({ ...state, isSaving: false });
            await setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'File uploaded successfully.'
                }
            });
        }
    }),
    pure
);

const ArticleEdit = props => {
    const {
        state, handleFormChange, updateDescription, saveArticle, switchMediaType,
        getSignedUrl, onUploadStart, onError, onFinishUpload, setTags
    } = props;
    const { formData: { title, description, tags, videoURL }, isVideoUrl, isSaving } = state;
    return (
        <Grid container className='mainBody articleEdit'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='titleSection'>
                    <TextField
                        // error={touched.name && errors.name}
                        // helperText={errors.name}
                        name="title"
                        label="Title"
                        placeholder="Add title..."
                        className='textField'
                        fullWidth
                        onChange={handleFormChange}
                        value={title}
                        InputProps={{
                            classes: {
                                input: 'titleInput',
                            }
                        }}
                    />
                </section>
                <section className='articleBodySection'>
                    <p className='infoMsg'>Write your article below.</p>
                    <FroalaEditor
                        config={{
                            placeholderText: 'Article body...',
                            iconsTemplate: 'font_awesome_5',
                            toolbarInline: true,
                            charCounterCount: false,
                            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                        }}
                        model={description}
                        onModelChange={updateDescription}
                    />
                </section>
                <section className='mediaUpload'>

                </section>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <section className='tags'>
                        <p className='helperText'>Tag your article</p>
                        <TagsInput value={tags} onChange={setTags} helpTagName='tag' />
                    </section>
                    <hr />

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
                                onChange={handleFormChange}
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

                    <Button className='publishBtn' onClick={saveArticle}>
                        Publish article
                    </Button>
                </div>
            </Grid>
        </Grid>
    );
};

export default ArticleEditHOC(ArticleEdit);