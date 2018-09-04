import React from 'react';
import { Grid, TextField, Button, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
// import S3Uploader from 'react-s3-uploader';

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


const NewArticle = (props) => {
    const {
        handleFormChange, formData: { id, title, description, videoURL, tags },
        updateDescription, saveArticle,
        isVideoUrl, switchMediaType,
        openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess,
        getSignedURL, handleFroalaSuccess, handleFroalaError,
        setTags
    } = props;

    console.log(props);

    return (
        <div className='newArticleRoot'>
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
                            value={title || ''}
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
                                imageUploadRemoteUrls: false,
                                toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo'],
                                events: {
                                    'froalaEditor.image.beforeUpload': (e, editor, images) => getSignedURL(e, editor, images),
                                    'froalaEditor.image.uploaded': (e, editor, response) => handleFroalaSuccess(e, editor, response),
                                    'froalaEditor.image.error': (e, editor, error, response) => handleFroalaError(e, editor, error, response)
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

                                <React.Fragment>
                                    <Button className='imgUpload' onClick={openImageUpload}>
                                        Upload
                                </Button>
                                    <ImageUploader
                                        type
                                        id={id}
                                        open={imageUploadOpen}
                                        onClose={closeImageUpload}
                                        onError={handleError}
                                        onSuccess={handleSuccess}
                                    />
                                </React.Fragment>
                            }
                        </section>

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