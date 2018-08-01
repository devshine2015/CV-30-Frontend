import React from 'react';
import { Grid, TextField, Button, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

const NewArticle = ({
    handleFormChange, formData: { title, description, tags, videoURL },
    updateDescription, saveArticle,
    isVideoUrl, switchMediaType,
    getSignedUrl, onUploadStart, onError, onFinishUpload, isSaving
}) => {
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
                            <TextField
                                // error={touched.name && errors.name}
                                // helperText={errors.name}
                                name="tags"
                                label="Tags"
                                placeholder="Add tags..."
                                className='textField'
                                fullWidth
                                onChange={handleFormChange}
                                value={tags}
                                helperText="Add tags that best represents your article as it will be appreciated by people based on the tags you selected."
                                FormHelperTextProps={{
                                    classes: { root: 'inputHelperText' }
                                }}
                                InputProps={{
                                    classes: {
                                        input: 'textFieldInput',
                                        underline: 'textFieldUnderline'
                                    },
                                }}
                                InputLabelProps={{
                                    className: 'textFieldLabel'
                                }}
                            />
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
        </div>
    );
};

export default NewArticle;