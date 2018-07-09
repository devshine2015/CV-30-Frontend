import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers, lifecycle } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid/v4';

import { setExperience, setProject, currentUserQuery, googleMapsQuery } from '../../../../store/queries';

const ExperienceEdit = (props) => {
    const { formData, isVideoUrl, switchMediaType, handleFormChange, closeEditor, submitForm, type, autocompleteHandle } = props;
    const { position, company, location, startDate, endDate, isCurrent, description, video } = formData;

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
                <TextField
                    name="location"
                    label="Add location"
                    placeholder="Location..."
                    className='textField'
                    fullWidth
                    inputRef={autocompleteHandle}
                    value={location || ''}
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
                        value={video && video.path || ''}
                    /> :
                    <label htmlFor="fileUpload">
                        <input
                            accept="image/*"
                            className='hiddenFileInput'
                            id="fileUpload"
                            name="fileUpload"
                            multiple
                            type="file"
                            onChange={handleFormChange}
                        />
                        <Button component="span" className='uploadBtn'>
                            Upload
                        </Button>
                    </label>
                }
            </section>
            <section className='editControls'>
                <IconButton className='cancelBtn' onClick={closeEditor}>
                    <Icon>close</Icon>
                </IconButton>
                <IconButton className='submitBtn' onClick={submitForm}>
                    <Icon>done</Icon>
                </IconButton>
            </section>
        </form>
    )
};

const ExperienceEditHOC = compose(
    withRouter,
    graphql(setExperience, { name: 'setExperience' }),
    graphql(setProject, { name: 'setProject' }),
    graphql(googleMapsQuery, { name: 'googleMapsData' }),
    withRouter,
    withState('isAutocompleteInit', 'setAutocompleteInit', false),
    withState('autocompleteHandle', '', () => React.createRef()),
    withState('formData', 'setFormData', ({ job }) => {
        if (!job)
            return {
                video: {
                    name: 'video',
                    path: ''
                }
            };

        const { id, company, position, location, startDate, endDate, isCurrent, i18n, videos } = job;
        const { description } = i18n && i18n[0];

        let data = {
            id, company, position, location, startDate, endDate, isCurrent, description, video: !!videos.length ? { ...videos[0], name: 'video' } : { name: 'video', path: '' }
        };
        return data;
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withHandlers({
        handleFormChange: props => event => {
            if (typeof event.name != undefined && event.name == 'video') {
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
        submitForm: ({ formData, setExperience, setProject, type, match, closeEditor }) => async () => {
            let { id, title, description, position, company, startDate, endDate, isCurrent, video, location } = formData;
            const videos = [];
            if (video.path && !!video.path.length) {
                videos.push({
                    id: video.id ? video.id : uuid(),
                    source: id,
                    path: video.path ? video.path : '',
                    sourceType: type
                });
                debugger;
            }
            switch (type) {
                case 'experience':
                    try {
                        await setExperience({
                            variables: {
                                experience: {
                                    id, location, title, description, position, company, startDate, endDate, isCurrent, videos
                                },
                                language: match.params.lang
                            },
                            refetchQueries: [{
                                query: currentUserQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: match.params.lang
                                }
                            }]
                        });
                    }
                    catch (err) {
                        console.log(err);
                    }
                    closeEditor();
                    break;
                case 'project':
                    try {
                        await setProject({
                            variables: {
                                project: {
                                    id, location, title, description, position, company, startDate, endDate, isCurrent, videos
                                },
                                language: match.params.lang
                            },
                            refetchQueries: [{
                                query: currentUserQuery,
                                fetchPolicy: 'network-only',
                                name: 'currentUser',
                                variables: {
                                    language: match.params.lang
                                }
                            }]
                        });
                    }
                    catch (err) {
                        console.log(err);
                    }
                    closeEditor();
                    break;
                default:
                    return false;
            }

        },
        initAutocomplete: ({ isAutocompleteInit, setAutocompleteInit, autocompleteHandle, setFormData }) => () => {
            if (isAutocompleteInit) return;
            const autocompleteInstance = new window.google.maps.places.Autocomplete(autocompleteHandle.current);
            autocompleteInstance.addListener('place_changed', () => {
                const place = autocompleteInstance.getPlace();
                if (!place.geometry) {
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place) {
                    setFormData(state => ({ ...state, 'location': place.formatted_address }));
                }
            });
            setAutocompleteInit(true);
        }
    }),
    lifecycle({
        componentDidMount() {
            if (this.props.googleMapsData.googleMaps.isLoaded && window.google && !this.props.isAutocompleteInit) this.props.initAutocomplete();
        },
        componentDidUpdate() {
            if (this.props.googleMapsData.googleMaps.isLoaded && window.google && !this.props.isAutocompleteInit) this.props.initAutocomplete();
        }
    }),
    pure
);

export default ExperienceEditHOC(ExperienceEdit);