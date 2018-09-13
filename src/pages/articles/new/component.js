import React from 'react';
import { Grid, TextField, Button, Popover, IconButton, Icon, Checkbox } from '@material-ui/core';
import ReactPlayer from 'react-player';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import ImageUploader from '../../../components/imageUploader';
import TagsInput from '../../../components/TagsInput';
import { s3BucketURL } from '../../../constants/s3';

const NewArticle = (props) => {
    const {
        handleFormChange, state: { formData: { id, title, description, tags }, imageUploadOpen, videoShareAnchor, videoURL, isVideoUrlValid },
        updateDescription, saveArticle,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        setTags, bindEditor, removeImage,
        openVideoShare, closeVideoShare, updateVideoUrl,
        images, selectFeaturedImage, videos, selectFeaturedVideo
    } = props;

    // debugger;
    return (
        <div className='newArticleRoot'>
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
                            id={id}
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
                                imageUploadRemoteUrls: false,
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
        </div>
    );
};

export default NewArticle;