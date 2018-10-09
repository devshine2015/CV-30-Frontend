import React from 'react';
import { Grid, TextField, Button, Popover, IconButton, Icon, Checkbox } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { FormattedMessage } from 'react-intl'
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { Link } from 'react-router-dom';

import ImageUploader from '../../../components/imageUploader';
import TagsInput from '../../../components/TagsInput';
import { s3BucketURL } from '../../../constants/s3';

const NewArticle = (props) => {
    const {
        handleFormChange, state: { formData: { id, title, description, tags }, imageUploadOpen, videoShareAnchor, videoURL, isVideoUrlValid },
        updateDescription, saveArticle,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        setTags, bindEditor, removeImage,
        openVideoShare, closeVideoShare, updateVideoUrl, removeVideo, cancelVideoPopover,
        images, selectFeaturedImage, videos, selectFeaturedVideo, match
    } = props;

    return (
        <div className='newArticleRoot'>
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
                            id={id}
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
                        <div className="btnsContainer">
                            <FormattedMessage id="articles.new.publishBtn" defaultMessage="Publish article" description="Publish article">
                                {(text) => (
                                    <Button className='publishBtn' onClick={saveArticle}>
                                        {text}
                                    </Button>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="articles.new.cancelBtn" defaultMessage="Cancel" description="Cancel">
                                {(text) => (
                                    <Link to={`/${match.params.lang}/news`} className='cancelBtn'>{text}</Link>
                                )}
                            </FormattedMessage>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default NewArticle;