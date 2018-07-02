import React from 'react';
import { Button, TextField, Switch as ToggleSwitch, FormLabel, FormGroup, IconButton, Icon } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { handleArticle } from '../store/queries';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';
import S3Uploader from 'react-s3-uploader';

const NewArticleHOC = compose(
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
        saveArticle: ({ formData, handleArticle, setIsSaving, isSaving }) => async () => {
            if (isSaving)
                return false;

            console.log(formData);
            setIsSaving(true);

            try {
                let result = await handleArticle({
                    variables: {
                        language: 'en',
                        article: {
                            id: formData.id,
                            title: formData.title,
                            videos: [],
                            images: formData.images,
                            description: formData.description
                        },
                        options: {
                            // articleId: formData.id,
                            // companyId: formData.id,
                            // isFeatured: true
                        }
                    }
                });

                console.log(result);

            }
            catch (err) {
                console.log(err);
            }
            setIsSaving(true);
        },
        getSignedUrl: ({ formData }) => async (file, callback) => {
            let id = formData.id;
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = [id, getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type
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
        onUploadStart: ({ setIsSaving, formData, setFormData }) => (file, next) => {
            let size = file.size;
            if (size > 1024 * 1024) {
                alert('File is too big!');
            } else {
                let newFormData = Object.assign({}, formData);

                newFormData.images = [{
                    id: uuid(),
                    title: file.name,
                    isFeatured: true,
                    sourceType: 'company',
                    source: formData.id, //article id,
                    path: 'bla' // {/server/user | company/article/image}

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

const NewArticle = props => {
    const {
        handleFormChange, isVideoUrl, switchMediaType, formData,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload,
        onClose, saveArticle, isSaving
    } = props;
    const { title, description, videoURL } = formData;

    return (
        <form className='newArticleForm' noValidate autoComplete='off'>
            <h4>Add article</h4>
            <section className='infoSection'>
                <TextField
                    name="title"
                    label="Article title"
                    placeholder="Title..."
                    className='textField'
                    fullWidth
                    onChange={handleFormChange}
                    value={title || ''}
                />
                <TextField
                    name="description"
                    label="Article body"
                    placeholder="Article body..."
                    className='textField'
                    multiline
                    rows={1}
                    rowsMax={10}
                    fullWidth
                    onChange={handleFormChange}
                    value={description || ''}
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
                        fullWidth
                        className='textField'
                        onChange={handleFormChange}
                        value={videoURL || ''}
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
                        // autoUpload={false}
                        // ref={uploader => { this.uploader = uploader; }}
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
        </form>
    );
};

export default NewArticleHOC(NewArticle);