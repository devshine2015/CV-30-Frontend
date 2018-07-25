import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import Edit from './components/edit';
import Show from './components/show';

const Article = props => {
    const { editMode, switchEditMode } = props;
    return (
        <div className='articleRoot'>
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
            {editMode ? <Edit {...props} /> : <Show {...props} />}
        </div>
    );
};

export default Article;