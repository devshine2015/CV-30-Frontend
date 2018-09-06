import React from 'react';
import { Modal, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Icon, IconButton, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import { handleArticle, setFeedbackMessage } from '../../../store/queries';
import { landingPageRefetch } from '../../../store/refetch';
import ImageUploader from '../../../components/imageUploader';

const ArticlePopUpHOC = compose(
    withRouter,
    graphql(handleArticle, {
        name: 'handleArticle'
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', () => {
        return {
            id: uuid()
        };
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        handleFormChange: ({ setFormData }) => event => {
            const target = event.currentTarget;
            const value = target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setFormData(state => ({ ...state, [name]: value }));
        },
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        updateDescription: ({ setFormData }) => text => setFormData(state => ({ ...state, 'description': text })),

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
        handleSuccess: ({ setFormData, formData: { id } }) => async ({ path, filename }) =>
            setFormData(state => ({
                ...state, 'images': [{
                    id: uuid(),
                    title: filename,
                    sourceType: 'article',
                    source: id,
                    path: path ? path : `/articles/${id}/${filename}`
                }]
            })),

        saveArticle: ({ formData, handleArticle, match: { params: { lang: language } }, onClose, setFeedbackMessage }) => async () => {
            const { id, title, description, videoURL, images } = formData;
            let article = {
                id,
                title,
                description,
                postAs: 'landingPage',
                images,
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
                        language,
                        article
                    },
                    refetchQueries: [
                        landingPageRefetch(language)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                onClose();
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

    }),
    pure
)

const ArticlePopUp = ({
    open, onClose,
    saveArticle,
    formData: { id, title, description, videoURL },
    handleFormChange, isVideoUrl, switchMediaType, updateDescription,
    openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess
}) => {
    return (
        <Modal
            open={open}
            classes={{
                root: 'modalRoot'
            }}
            onClose={onClose}
        >
            <div className='LP_storyEditPaper'>
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

                            <FroalaEditor
                                config={{
                                    placeholderText: 'Article body goes here',
                                    iconsTemplate: 'font_awesome_5',
                                    toolbarInline: true,
                                    charCounterCount: false,
                                    quickInsertTags: [''],
                                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                }}
                                model={description}
                                onModelChange={updateDescription}
                            />
                            <hr />
                            <FormGroup row className='mediaToggle'>
                                <span className='mediaToggleLabel'>Article cover</span>
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
                                <React.Fragment>
                                    <Button className='badgeRoot' onClick={openImageUpload}>
                                        Upload
                                    </Button>
                                    <ImageUploader
                                        type='article'
                                        open={imageUploadOpen}
                                        onClose={closeImageUpload}
                                        onError={handleError}
                                        onSuccess={handleSuccess}
                                        id={id}
                                    />
                                </React.Fragment>
                            }
                        </section>
                        <section className='editControls'>
                            <IconButton className='cancelBtn' onClick={onClose}>
                                <Icon>close</Icon>
                            </IconButton>
                            <IconButton className='submitBtn' onClick={saveArticle}>
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