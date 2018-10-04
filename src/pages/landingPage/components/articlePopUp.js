import React from 'react';
import { Modal, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Icon, IconButton, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl'
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
    withState('state', 'setState', () => ({
        formData: {
            id: uuid()
        },
        isVideoUrl: true,
        imageUploadOpen: false
    })),
    withHandlers({
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const value = target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({
                ...state,
                formData: {
                    ...state.formData,
                    [name]: value
                }
            });
        },
        switchMediaType: ({ state, setState }) => () => setState({ ...state, isVideoUrl: !state.isVideoUrl }),
        updateDescription: ({ state, setState }) => description => setState({ ...state, formData: { ...state.formData, description }}),
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
        handleSuccess: ({ setState, state }) => async ({ path, filename }) =>
            setState({
                ...state,
                formData: {
                    ...state.formData,
                    'images': [{
                        id: uuid(),
                        title: filename,
                        sourceType: 'article',
                        source: state.formData.id,
                        path: path ? path : `/articles/${state.formData.id}/${filename}`
                    }]
                }
            }),
        saveArticle: ({ state: { formData }, handleArticle, match: { params: { lang: language } }, onClose, setFeedbackMessage }) => async () => {
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
    state: {
        imageUploadOpen,
        isVideoUrl,
        formData: { id, title, description, videoURL }
    },
    handleFormChange, switchMediaType, updateDescription,
    openImageUpload, closeImageUpload, handleError, handleSuccess
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
                        <FormattedMessage id="landing.addArticle" defaultMessage="Add article" description="Add article">
                            {(text) => (
                                <h4>{text}</h4>
                            )}
                        </FormattedMessage>
                        
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
                            <FormattedMessage id="landing.articleBody" defaultMessage="Article body goes here" description="Article body goes here">
                                {(text) => (
                                    <FroalaEditor
                                        config={{
                                            placeholderText: text,
                                            iconsTemplate: 'font_awesome_5',
                                            toolbarInline: true,
                                            charCounterCount: false,
                                            // quickInsertTags: [''],
                                            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                        }}
                                        model={description}
                                        onModelChange={updateDescription}
                                    />
                                )}
                            </FormattedMessage>
                            
                            <hr />
                            <FormGroup row className='mediaToggle'>
                                <FormattedMessage id="landing.articleCover" defaultMessage="Article cover" description="Article cover">
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

                        </section>
                        <section className='mediaUpload'>
                            {isVideoUrl ?
                                <FormattedMessage id="feed.addVideoUrl" defaultMessage="Add video URL \n Video URL..." description="Video URL">
                                        {(text) => (
                                            <TextField
                                                name="videoURL"
                                                label={text.split("\n")[0]}
                                                placeholder={text.split("\n")[1]}
                                                className='textField'
                                                onChange={handleFormChange}
                                                value={videoURL || ''}
                                                fullWidth
                                            />
                                        )}
                                </FormattedMessage>
                                 :
                                <React.Fragment>
                                    <FormattedMessage id="feed.imageUpload" defaultMessage="Upload" description="Upload">
                                        {(text) => (
                                            <Button className='badgeRoot' onClick={openImageUpload}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                    
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