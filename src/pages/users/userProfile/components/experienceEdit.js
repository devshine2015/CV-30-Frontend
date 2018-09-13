import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid/v4';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';

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
    withState('state', 'setState', ({ job, type }) => {
        let formData = {};
        let isVideoUrl = false;
        if (!job) {
            isVideoUrl = true;
            formData = {
                id: uuid(),
                video: {
                    name: 'video',
                    path: ''
                }
            };
        } else {
            const { id, company, position, location, startDate, endDate, isCurrent, description, videos, images } = job;
            formData = {
                id, company, position, location, startDate, endDate,
                isCurrent, description,
                video: !!videos.length ? { ...videos[0], name: 'video' } : { name: 'video', path: '' },
                image: !!images.length ? { id: images[0].id, path: images[0].path, sourceType: type } : null
            };
            if (images && images.length > 0) isVideoUrl = false;
            else isVideoUrl = true;
        }
        return {
            formData,
            isVideoUrl,
            isSaving: false,
            uploadProgress: 0,
            uploadError: null,
            imageUploadOpen: false
        }
    }),
    withHandlers({
        handleFormChange: ({ state, setState }) => event => {
            if (typeof event.name !== undefined && event.name === 'video') {
                setState({ ...state, formData: { ...state.formData, video: event } });
                return;
            }

            const target = event.currentTarget;
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({ ...state, formData: { ...state.formData, [name]: value } });
        },
        switchMediaType: ({ state, setState }) => () => setState({ ...state, isVideoUrl: !state.isVideoUrl }),
        submitForm: ({ state: { formData }, setExperience, setProject, type, match, closeEditor, setFeedbackMessage }) => async () => {
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
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setState, state, type }) => async ({ path, filename }) => {
            let image = {
                id: uuid(),
                sourceType: type,
                source: state.formData.id, //article id
                path: path ? path : `/${type}/${state.formData.id}/${filename}`
            };
            setState({ ...state, formData: { ...state.formData, image } });
        },
        removeImage: ({ state, setState }) => () => setState({ ...state, formData: { ...state.formData, image: null } }),
        handleStartDateChange: ({ state, setState }) => startDate => setState({ ...state, formData: { ...state.formData, startDate } }),
        handleEndDateChange: ({ state, setState }) => endDate => setState({ ...state, formData: { ...state.formData, endDate } }),
    }),
    pure
);

const ExperienceEdit = props => {
    const {
        state: { formData, isVideoUrl, imageUploadOpen, isSaving },
        switchMediaType,
        handleFormChange,
        handleStartDateChange,
        handleEndDateChange,
        closeEditor,
        submitForm,
        type,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
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
                    {/* <TextField
                        name="startDate"
                        type="date"
                        value={startDate ? (new Date(startDate)).toISOString().split("T")[0] : ''}
                        onChange={handleFormChange}
                    /> */}
                    <DatePicker
                        label="Start Date"
                        format="DD/MM/YYYY"
                        maxDate={endDate || new Date()}
                        value={startDate || moment().subtract(1, 'days')}
                        onChange={handleStartDateChange}
                        animateYearScrolling
                    />
                    {/* <TextField
                        name="endDate"
                        type="date"
                        disabled={isCurrent}
                        value={endDate ? (new Date(endDate)).toISOString().split("T")[0] : ''}
                        onChange={handleFormChange}
                    /> */}
                    <DatePicker
                        label="End Date"
                        format="DD/MM/YYYY"
                        disabled={isCurrent}
                        disableFuture={true}
                        minDate={startDate || ''}
                        value={endDate || moment().subtract(1, 'days')}
                        onChange={handleEndDateChange}
                        animateYearScrolling
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