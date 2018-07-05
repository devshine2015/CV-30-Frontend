import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { setExperience, setProject, currentUserQuery } from '../../../../store/queries';

const ExperienceEdit = (props) => {
    const { formData, isVideoUrl, switchMediaType, handleFormChange, closeEditor, submitForm, type } = props;
    const { position, company, location, startDate, endDate, isCurrent, description, videoURL } = formData;

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
                        name="videoURL"
                        label="Add video URL"
                        placeholder="Video URL..."
                        fullWidth
                        className='textField'
                        onChange={handleFormChange}
                        value={videoURL || ''}
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
    withRouter,
    withState('formData', 'setFormData', ({ job }) => {
        if (!job)
            return {};

        const { id, company, position, location, startDate, endDate, isCurrent, i18n } = job;
        const { description } = i18n;

        let data = {
            id, company, position, location, startDate, endDate, isCurrent, description
        };

        return data;
    }),
    withState('isVideoUrl', 'changeMediaType', true),
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
        submitForm: ({ formData, setExperience, setProject, type, match }) => async () => {
            let { id, title, description, position, company, startDate, endDate, isCurrent } = formData;
            switch (type) {

                case 'experience':
                    try {
                        await setExperience({
                            variables: {
                                experience: {
                                    id, title, description, position, company, startDate, endDate, isCurrent
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
                    break;
                case 'project':
                    try {
                        await setProject({
                            variables: {
                                project: {
                                    id, title, description, position, company, startDate, endDate, isCurrent
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
                    break;
                default:
                    return false;
            }

        }
    }),
    pure
);

export default ExperienceEditHOC(ExperienceEdit);