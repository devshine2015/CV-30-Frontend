import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel, IconButton, Icon, Switch as ToggleSwitch, FormGroup, Button } from '@material-ui/core';
import { compose, pure, withState, withHandlers, lifecycle } from 'recompose';

const ExperienceEdit = (props) => {
    debugger;
    const { formData, isVideoUrl, switchMediaType, handleFormChange, closeEditor } = props;
    const { position, company, location, startDate, endDate, stillWorkThere, description, videoURL, fileUpload } = formData;

    return (
        <form className='experienceForm' noValidate autoComplete='off'>
            <h4>Add / edit experience</h4>
            <section className='infoSection'>
                <TextField
                    name="position"
                    label="Add position"
                    placeholder="Position..."
                    className='textField'
                    fullWidth
                    onChange={handleFormChange}
                    value={position}
                />
                <TextField
                    name="company"
                    label="Add company"
                    placeholder="Company..."
                    className='textField'
                    fullWidth
                    onChange={handleFormChange}
                    value={company}
                />
                <TextField
                    name="location"
                    label="Add location"
                    placeholder="Location..."
                    className='textField'
                    fullWidth
                    value={location}
                    onChange={handleFormChange}
                />
                <div className='datePickers'>
                    <p>Date</p>
                    <TextField
                        name="startDate"
                        type="date"
                        value={startDate}
                        onChange={handleFormChange}
                    />
                    <TextField
                        name="endDate"
                        type="date"
                        disabled={stillWorkThere}
                        value={endDate}
                        onChange={handleFormChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name='stillWorkThere'
                                checked={stillWorkThere}
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
                    value={description}
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
                        value={videoURL}
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
                <IconButton className='submitBtn'>
                    <Icon>done</Icon>
                </IconButton>
            </section>
        </form>
    )
};

const SkillsEditHOC = compose(
    withState('formData', 'setFormData', ({ job }) => (job || {})),
    withState('isVideoUrl', 'changeMediaType', true),
    withHandlers({
        handleFormChange: props => event => {
            debugger;
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
        }
    }),
    pure
);

export default SkillsEditHOC(ExperienceEdit);