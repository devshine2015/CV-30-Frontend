import React from 'react';
import { Grid, TextField, Button, Checkbox, Popover, IconButton, Icon } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { compose, withState, withHandlers, pure } from 'recompose';
import ReactPlayer from 'react-player';
import uuid from 'uuidv4';
import { FormattedMessage } from 'react-intl'

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
import ImageUploader from '../../../../components/imageUploader';
import { s3BucketURL, articlesFolder } from '../../../../constants/s3';
import { testVideoUrlValid, getFroalaInsertStringFromVideoUrl } from '../../common';

const ArticleEditHOC = compose(
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ getArticle: { article: { id: articleId, title, description, tags } } }) => ({
        articleId,
        title: title || '',
        description: description || '',
        tags: (tags && tags.map(tag => tag.title)) || [],
        videoURL: '',
        isSaving: false,
        imageUploadOpen: false,
        editor: null,
        videoShareAnchor: null,
        isVideoUrlValid: false
    })),
    withState('images', 'setImages', ({ getArticle: { article: { images } } }) =>
        images.map(({ id, path, isFeatured }) => ({ id, path, isFeatured }))),
    withState('videos', 'setVideos', ({ getArticle: { article: { videos } } }) =>
        videos.map(({ id, path, isFeatured }) => ({ id, path, isFeatured }))),
    withHandlers({
        bindEditor: ({ state, setState }) => (e, editor) => setState({ ...state, editor }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        openVideoShare: ({ state, setState }) => ev => setState({ ...state, videoShareAnchor: ev.target }),
        closeVideoShare: ({ state, setState, setVideos }) => () => {
            if (state.isVideoUrlValid) {
                setVideos([{
                    id: uuid(),
                    path: state.videoURL,
                    isFeatured: false
                }]);
                setState({ ...state, videoShareAnchor: null });
                state.editor.video.insert(getFroalaInsertStringFromVideoUrl(state.videoURL));
            }
            else
                return false;
        },
        cancelVideoPopover: ({ state, setState }) => () => setState({ ...state, videoShareAnchor: null, videoURL: '' }),
        updateVideoUrl: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const videoURL = target.type === 'checkbox' ? target.checked : target.value;
            let isVideoUrlValid = testVideoUrlValid(videoURL);
            setState({
                ...state,
                videoURL,
                isVideoUrlValid
            })
        },
        handleError: () => error => { console.log(error) },
        handleSuccess: ({ images, setImages, state: { editor, articleId } }) => ({ path, filename }) => {
            setImages([...images, {
                id: uuid(),
                path: path ? path : `/${articlesFolder}/${articleId}/${filename}`,
                isFeatured: false
            }]);
            editor.image.insert(path ? `${s3BucketURL}${path}` : `${s3BucketURL}/${articlesFolder}/${articleId}/${filename}`);
        },
        selectFeaturedImage: ({ images, setImages, videos, setVideos }) => imageId => {
            setVideos(videos.map(video => ({
                ...video,
                isFeatured: false
            })));

            setImages(images.map(image => ({
                ...image,
                isFeatured: image.id === imageId
            })))
        },
        removeImage: ({ images, setImages }) => (e, editor, $img) => {
            const path = $img[0].src.replace(s3BucketURL, '');
            setImages(images.filter(image => image.path !== path));
        },
        removeVideo: ({ videos, setVideos }) => (e, editor, $video) => {
            let iframe = $video.find('iframe'), src, url;
            if (iframe)
                src = iframe.attr('src');
            if (src)
                url = src.replace("embed/", "watch?v=");
            if (url)
                setVideos(videos.filter(video => video.path !== url));
        },
        selectFeaturedVideo: ({ images, setImages, videos, setVideos }) => videoId => {
            setVideos(videos.map(video => ({
                ...video,
                isFeatured: video.id === videoId
            })));

            setImages(images.map(image => ({
                ...image,
                isFeatured: false
            })))
        },
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
        saveArticle: props => async () => {
            const { handleArticle, state, setState, match, setFeedbackMessage, images, videos } = props,
                { title, description, tags } = state;

            const article = {
                id: match.params.articleId,
                title,
                description,
                images,
                videos,
                tags
                // tags: tags.map(tag => tag.title)
            };

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
    }),
    pure
);

const ArticleEdit = props => {
    const {
        state, handleFormChange, updateDescription, saveArticle, setTags,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        images, videos, selectFeaturedImage, selectFeaturedVideo, bindEditor, removeImage,
        openVideoShare, closeVideoShare, updateVideoUrl, removeVideo, cancelVideoPopover
    } = props;
    const { articleId, title, description, tags, videoURL, videoShareAnchor, imageUploadOpen, isVideoUrlValid } = state;
    return (
        <Grid container className='mainBody articleEdit'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='titleSection'>
                    <FormattedMessage id="articles.new.title" defaultMessage="Title\nAdd title..." description="Add title">
                        {(text) => (
                            <TextField
                                name="title"
                                label={text.split("\n")[0]}
                                placeholder={text.split("\n")[1]}
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
                        )}
                    </FormattedMessage>
                </section>
                <section className='mediaUpload'>
                    <FormattedMessage id="articles.new.helperText" defaultMessage="Add/Edit images or embed video links." description="Add/Edit images or embed video links.">
                        {(text) => (
                            <p className='helperText'>
                                {text}
                            </p>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="articles.new.addImage" defaultMessage="Add image" description="Add image">
                        {(text) => (
                            <Button className='mediaBtn' onClick={openImageUpload}>
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
                        id={articleId}
                    />

                    <FormattedMessage id="articles.new.shareVideo" defaultMessage="Share video" description="Share video">
                        {(text) => (
                            <Button className='mediaBtn' onClick={openVideoShare}>
                                {text}
                            </Button>

                        )}
                    </FormattedMessage>

                    <Popover
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(videoShareAnchor)}
                        anchorEl={videoShareAnchor}
                        onClose={closeVideoShare}
                        classes={{
                            paper: 'promoEditPaper'
                        }}
                        disableBackdropClick
                    >
                        <div className='popupBody'>
                            <FormattedMessage id="articles.new.videoUrl" defaultMessage="Video URL\nEnter video link...\nInvalid video URL" description="Enter video link">
                                {(text) => (
                                    <TextField
                                        name="videoUrl"
                                        label={text.split("\n")[0]}
                                        placeholder={text.split("\n")[1]}
                                        className='textField'
                                        fullWidth
                                        onChange={updateVideoUrl}
                                        value={videoURL}
                                        helperText={(!!videoURL && !isVideoUrlValid && text.split("\n")[2])}
                                        error={!!videoURL && !isVideoUrlValid}
                                    />
                                )}
                            </FormattedMessage>
                        </div>
                        <div className='popupFooter'>
                            <IconButton
                                onClick={cancelVideoPopover}
                                className='footerCancel'
                            >
                                <Icon>close</Icon>
                            </IconButton>
                            <IconButton
                                style={ !videoURL || !isVideoUrlValid ? { background: '#fff', color: '#aaa', border: '1px solid #aaa' } : {} }
                                onClick={closeVideoShare}
                                className='footerCheck'
                                disabled={!videoURL || !isVideoUrlValid}
                            >
                                <Icon>done</Icon>
                            </IconButton>
                        </div>
                    </Popover>
                </section>
                <section className='articleBodySection'>
                    <FormattedMessage id="articles.new.infoMsg" defaultMessage="Write your article below." description="Write your article below.">
                        {(text) => (
                            <p className='infoMsg'>{text}</p>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="articles.new.froalaArticle" defaultMessage="Article body..." description="Article body">
                        {(text) => (
                            <FroalaEditor
                                config={{
                                    placeholderText: text,
                                    iconsTemplate: 'font_awesome_5',
                                    toolbarInline: true,
                                    charCounterCount: false,
                                    imageUploadRemoteUrls: false,
                                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo'],
                                    quickInsertButtons: [ 'table', 'ul', 'ol', 'hr' ],
                                    events: {
                                        'froalaEditor.initialized': bindEditor,
                                        'froalaEditor.image.removed': removeImage,
                                        'froalaEditor.video.removed': removeVideo
                                    }
                                }}
                                model={description}
                                onModelChange={updateDescription}
                            />
                        )}
                    </FormattedMessage>
                </section>
                <section className='mediaUpload'>

                </section>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <section className='tags'>
                        <FormattedMessage id="articles.new.tagArticle" defaultMessage="Tag your article" description="Tag your article">
                            {(text) => (
                                <p className='helperText'>{text}</p>
                            )}
                        </FormattedMessage>
                        <TagsInput value={tags} onChange={setTags} helpTagName='tag' />
                    </section>
                    
                    {((images && images.length > 0) || (videos && videos.length > 0)) &&
                        <section className='featuredMedia'>
                            <FormattedMessage id="articles.new.coverImage" defaultMessage="Select a cover image for your article." description="Select a cover image for your article.">
                                {(text) => (
                                    <p className='helperText'>
                                        {text}
                                    </p>
                                )}
                            </FormattedMessage>
                            {(images && images.length > 0) &&
                                <div className='images'>
                                    {images.map(image => (
                                        <label key={image.id} className={image.isFeatured ? 'selected' : null}>
                                            <Checkbox
                                                checked={image.isFeatured}
                                                onChange={() => selectFeaturedImage(image.id)}
                                                className='hiddenInput'
                                            />
                                            <img src={`${s3BucketURL}${image.path}`} className='featuredImg' alt={image.id} />
                                            {image.isFeatured && <i className='fas fa-check fa-3x' />}
                                        </label>
                                    ))}
                                </div>
                            }
                            {(videos && videos.length > 0) &&
                                <div className='videos'>
                                    {videos.map(video => (
                                        <label key={video.id} className={video.isFeatured ? 'selected' : null}>
                                            <Checkbox
                                                checked={video.isFeatured}
                                                onChange={() => selectFeaturedVideo(video.id)}
                                                className='hiddenInput'
                                            />
                                            <ReactPlayer
                                                url={video.path}
                                                width='100%'
                                                height='100%'
                                                config={{
                                                    youtube: {
                                                        playerVars: {
                                                            showinfo: 0,
                                                            controls: 0,
                                                            modestbranding: 1,
                                                            loop: 1
                                                        }
                                                    }
                                                }}
                                                playing={false}
                                                style={{ pointerEvents: 'none' }}
                                            />
                                            {video.isFeatured && <i className='fas fa-check fa-3x' />}
                                        </label>
                                    ))}
                                </div>
                            }
                        </section>
                    }

                    <FormattedMessage id="articles.new.publishBtn" defaultMessage="Publish article" description="Publish article">
                        {(text) => (
                            <Button className='publishBtn' onClick={saveArticle}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                </div>
            </Grid>
        </Grid>
    );
};

export default ArticleEditHOC(ArticleEdit);