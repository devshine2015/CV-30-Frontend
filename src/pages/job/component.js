import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import Show from './components/show';
import Edit from './components/edit';

const Job = props => {
    const {
        editMode, switchEditMode
    } = props;
    return (
        <div className='jobRoot'>
            <FormGroup row className='editToggle'>
                <FormLabel className={!editMode ? 'active' : ''}>View</FormLabel>
                <ToggleSwitch checked={editMode} onChange={switchEditMode}
                    classes={{
                        switchBase: 'colorSwitchBase',
                        checked: 'colorChecked',
                        bar: 'colorBar',
                    }}
                    color="primary" />
                <FormLabel className={editMode ? 'active' : ''}>Edit</FormLabel>
            </FormGroup>
            {editMode ?
                <Edit {...props} />
                : <Show {...props} />
            }
        </div>
    );
}


export default Job;