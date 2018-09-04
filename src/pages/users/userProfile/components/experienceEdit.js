import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid/v4';

import { setExperience, setProject, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import ImageUploader from '../../../../components/imageUploader';
import LocationInput from '../../../../components/LocationInput';
import { s3BucketURL } from '../../../../constants/s3';

const ExperienceEditHOC = compose(
    withRouter,
    graphql(setExperience, { name: 'setExperience' }),
    graphql(setProject, { name: 'setProject' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', ({ job, type }) => {
        if (!job) {
            return {
                id: uuid(),
                video: {
                    name: 'video',
                    path: ''
                }
            };
        }

        const { id, company, position, location, startDate, endDate, isCurrent, i18n, videos, images } = job;
        let description = (i18n && i18n[0]) ? i18n[0].description : '';

        let data = {
            id, company, position, location, startDate, endDate,
            isCurrent, description,
            video: !!videos.length ? { ...videos[0], name: 'video' } : { name: 'video', path: '' },
            image: !!images.length ? { id: images[0].id, path: images[0].path, sourceType: type } : null
        };
        return data;
    }),
    withState('isVideoUrl', 'changeMediaType', ({ job }) => {
        if (!job)
            return true;

        let { images } = job;

        if (images && images.length > 0)
            return false;

        return true;
    }),
    withState('isSaving', 'setIsSaving', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
    withHandlers({
        handleFormChange: props => event => {
            if (typeof event.name !== undefined && event.name === 'video') {
                props.setFormData(state => ({ ...state, video: event }));
                return;
            }

            const target = event.currentTarget;
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        submitForm: ({ formData, setExperience, setProject, type, match, closeEditor, setFeedbackMessage }) => async () => {
            let { id, title, description, position, company, startDate, endDate, isCurrent, image, video, location } = formData;
            const videos = [], images = [];
            if (video.path && !!video.path.length) {
                videos.push({
                    id: video.id ? video.id : uuid(),
                    source: id,
                    path: video.path ? video.path : '',
                    sourceType: type
                });
            }
            if (image && image.path) {
                images.push({
                    id: image.id || uuid(),
                    source: id,
                    path: image.path,
                    sourceType: type
                });
            }
            let data = {
                id, location, title, description, position, company,
                startDate,
                isCurrent, videos, images
            };

            if (!isCurrent)
                data.endDate = endDate;

            switch (type) {
                case 'experience':
                    try {
                        await setExperience({
                            variables: {
                                experience: data,
                                language: match.params.lang
                            },
                            refetchQueries: [
                                currentProfileRefetch(match.params.lang)
                            ]
                        });
                        await setFeedbackMessage({
                            variables: {
                                status: 'success',
                                message: 'Changes saved successfully.'
                            }
                        });
                    }

                    catch ({ graphQLErrors }) {
                        console.log(JSON.stringify(graphQLErrors, null, 2));
                        let formattedError = graphQLErrors && graphQLErrors[0].reduce((result, current) => {
                            result += "\n" + current.message;
                            return result;
                        }, '')
                        await setFeedbackMessage({
                            variables: {
                                status: 'error',
                                message: formattedError
                            }
                        });
                    }
                    break;
                case 'project':
                    try {
                        await setProject({
                            variables: {
                                project: data,
                                language: match.params.lang
                            },
                            refetchQueries: [
                                currentProfileRefetch(match.params.lang)
                            ]
                        });
                        await setFeedbackMessage({
                            variables: {
                                status: 'success',
                                message: 'Changes saved successfully.'
                            }
                        });
                    }
                    catch ({ graphQLErrors }) {
                        let formattedError = graphQLErrors && graphQLErrors[0].reduce((result, current) => {
                            result += "\n" + current.message;
                            return result;
                        }, '')
                        await setFeedbackMessage({
                            variables: {
                                status: 'error',
                                message: formattedError
                            }
                        });
                    }
                    break;
                default:
                    return false;
            }
            closeEditor();
        },
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setFormData, formData: { id }, type }) => async ({ path, filename }) => {
            let image = {
                id: uuid(),
                sourceType: type,
                source: id, //article id
                path: path ? path : `/${type}/${id}/${filename}`
            };
            setFormData(state => ({ ...state, image }));
        },
        removeImage: ({ setFormData }) => () => setFormData(state => ({ ...state, image: null }))
    }),
    pure
);

const ExperienceEdit = props => {
    const {
        formData,
        isVideoUrl, switchMediaType,
        handleFormChange,
        closeEditor,
        submitForm,
        type,
        openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess,
        isSaving,
        removeImage
    } = props;

    const { id, position, company, location, startDate, endDate, isCurrent, description, video, image } = formData;

    return (
        <form className='experienceForm' noValidate autoComplete='off'>
            <h4>
                {type === 'experience' ? 'Add / edit experience' : 'Add / edit project'}
            </h4>
            <section className='infoSection'>
                <TextField
                    name="position"
                    label="Add position"
                    placeholder="Position..."
                    className='textField'
                    fullWidth
                    onChange={handleFormChange}
                    value={position || ''}
                />
                <TextField
                    name="company"
                    label="Add company"
                    placeholder="Company..."
                    className='textField'
                    fullWidth
                    onChange={handleFormChange}
                    value={company || ''}
                />
                <LocationInput
                    value={location}
                    onChange={handleFormChange}
                />
                <div className='datePickers'>
                    <p>Date</p>
                    <TextField
                        name="startDate"
                        type="date"
                        value={startDate ? (new Date(startDate)).toISOString().split("T")[0] : ''}
                        onChange={handleFormChange}
                    />
                    <TextField
                        name="endDate"
                        type="date"
                        disabled={isCurrent}
                        value={endDate ? (new Date(endDate)).toISOString().split("T")[0] : ''}
                        onChange={handleFormChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name='isCurrent'
                                checked={isCurrent || false}
                                onChange={handleFormChange}
                                color="primary"
                            />
                        }
                        label="Still work there"
                    />
                </div>
                <TextField
                    name="description"
                    label="Add description"
                    placeholder="Description..."
                    fullWidth
                    multiline
                    className='textField'
                    rowsMax="4"
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
                        name="video"
                        label="Add video URL"
                        placeholder="Video URL..."
                        fullWidth
                        className='textField'
                        onChange={(e) => handleFormChange({
                            ...video,
                            path: e.currentTarget.value
                        })}
                        value={video ? video.path : ''}
                    /> :
                    <React.Fragment>
                        {image ?
                            <div className="imagePreview">
                                <img src={`${s3BucketURL}${image.path}`} className='previewImg' alt='' />
                                <IconButton className='removeBtn' onClick={removeImage}>
                                    <Icon>cancel</Icon>
                                </IconButton>
                            </div> :
                            <Button className='uploadBtn' onClick={openImageUpload}>
                                Upload
                            </Button>
                        }
                        <ImageUploader
                            id={id}
                            type={type}
                            open={imageUploadOpen}
                            onClose={closeImageUpload}
                            onError={handleError}
                            onSuccess={handleSuccess}
                        />
                    </React.Fragment>

                }
            </section>
            <section className='editControls'>
                <IconButton className='cancelBtn' onClick={closeEditor} disabled={isSaving}>
                    <Icon>close</Icon>
                </IconButton>
                <IconButton className='submitBtn' onClick={submitForm} disabled={isSaving}>
                    <Icon>done</Icon>
                </IconButton>
            </section>
        </form>
    )
};

export default ExperienceEditHOC(ExperienceEdit);