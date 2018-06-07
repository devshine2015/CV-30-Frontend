import React from 'react';
import { TextField, Checkbox, FormLabel, FormControlLabel } from '@material-ui/core';

const ExperienceEdit = (props) => {
    const { stillWorkThere, updateWorkPlace } = props;

    return (
        <div className='experienceEditRoot'>
            <h4>Add / edit experience</h4>
            <form className='experienceForm' noValidate autoComplete={false}>
                <TextField
                    id="position"
                    label="Add position"
                    placeholder="Position..."
                    className='textField'
                    fullWidth
                />
                <TextField
                    id="company"
                    label="Add company"
                    placeholder="Company..."
                    className='textField'
                    fullWidth
                />
                <TextField
                    id="location"
                    label="Add location"
                    placeholder="Location..."
                    className='textField'
                    fullWidth
                />
                <div className='datePickers'>
                    <p>Date</p>
                    <TextField
                        id="startDate"
                        type="date"
                        defaultValue=""
                    />
                    <TextField
                        id="endDate"
                        type="date"
                        defaultValue=""
                        disabled={stillWorkThere}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={stillWorkThere}
                                onChange={updateWorkPlace}
                                value={stillWorkThere}
                                color="primary"
                            />
                        }
                        label="Still work there"
                    />
                </div>
                <TextField
                    id="description"
                    label="Add description"
                    placeholder="Description..."
                    fullWidth
                    multiline
                    className='textField'
                    rowsMax="4"
                />
            </form>
        </div>
    )
}

export default ExperienceEdit;