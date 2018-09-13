import React from 'react';
import { Grid, TextField, Button, Checkbox } from '@material-ui/core';
import { graphql } from 'react-apollo';
import { compose, withState, withHandlers, pure } from 'recompose';
import ReactPlayer from 'react-player';
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
import ImageUploader from '../../../../components/imageUploader';
import { s3BucketURL, articlesFolder } from '../../../../constants/s3';

const ArticleEditHOC = compose(
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ getArticle: { article: { id: articleId, title, description, tags, videoURL } } }) => ({
        articleId,
        title: title || '',
        description: description || '',
        tags: tags || [],
        videoURL: videoURL || '',
        isVideoUrl: true,
        isSaving: false,
        imageUploadOpen: false,
        editor: null
    })),
    withState('images', 'setImages', ({ getArticle: { article: { images } } }) =>
        images.map(({ id, path, isFeatured }) => ({ id, path, isFeatured }))),
    withState('videos', 'setVideos', ({ getArticle: { article: { videos } } }) => videos),
    withHandlers({
        bindEditor: ({ state, setState }) => (e, editor) => setState({ ...state, editor }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
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
                tags
            };

            // if (videoURL) {
            //     article.videos = [
            //         {
            //             id: uuid(),
            //             title: videoURL,
            //             sourceType: 'article',
            //             path: videoURL
            //         }
            //     ];
            // }

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
        images, videos, selectFeaturedImage, selectFeaturedVideo, bindEditor, removeImage
    } = props;
    const { articleId, title, description, tags, videoURL, isVideoUrl, isSaving, imageUploadOpen } = state;
    return (
        <Grid container className='mainBody articleEdit'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='titleSection'>
                    <TextField
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
                <section className='mediaUpload'>
                    <p className='helperText'>
                        Add/Edit images or embed video links.
                        </p>

                    <Button className='mediaBtn' onClick={openImageUpload}>
                        Add image
                        </Button>

                    <ImageUploader
                        type='article'
                        open={imageUploadOpen}
                        onClose={closeImageUpload}
                        onError={handleError}
                        onSuccess={handleSuccess}
                        id={articleId}
                    />
                    {/*
                        <Button className='mediaBtn' onClick={openVideoShare}>
                            Share video
                        </Button>

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
                                <TextField
                                    name="videoUrl"
                                    label="Video URL"
                                    placeholder="Enter video link..."
                                    className='textField'
                                    fullWidth
                                    onChange={updateVideoUrl}
                                    value={videoURL}
                                    helperText={(!!videoURL && !isVideoUrlValid && 'Invalid video URL')}
                                    error={!!videoURL && !isVideoUrlValid}
                                />
                            </div>
                            <div className='popupFooter'>
                                <IconButton
                                    onClick={closeVideoShare}
                                    className='footerCheck'
                                    disabled={!!videoURL && !isVideoUrlValid}
                                >
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                        </Popover>
*/}

                </section>
                <section className='articleBodySection'>
                    <p className='infoMsg'>Write your article below.</p>
                    <FroalaEditor
                        config={{
                            placeholderText: 'Article body...',
                            iconsTemplate: 'font_awesome_5',
                            toolbarInline: true,
                            charCounterCount: false,
                            toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo'],
                            events: {
                                'froalaEditor.initialized': bindEditor,
                                'froalaEditor.image.removed': removeImage
                            }
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

                    {((images && images.length > 0) || (videos && videos.length > 0)) &&
                        <section className='featuredMedia'>
                            <p className='helperText'>
                                Select a cover image for your article.
                                </p>
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

                    <Button className='publishBtn' onClick={saveArticle}>
                        Publish article
                    </Button>
                </div>
            </Grid>
        </Grid>
    );
};

export default ArticleEditHOC(ArticleEdit);