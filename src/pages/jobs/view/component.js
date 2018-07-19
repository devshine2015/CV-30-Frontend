import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import Show from './components/show';
import Edit from './components/edit';
import Loader from '../../../components/Loader';

const Job = props => {
    const {
        editMode, switchEditMode, getJobQuery: { loading, job },
        currentUser: { auth: { currentUser: { id: userId } } }
    } = props;

    if (loading)
        return <Loader />

    return (
        <div className='jobRoot'>
            {(job.company.owner.id === userId) &&
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
            }
            {editMode ?
                <Edit {...props} />
                : <Show {...props} />
            }
        </div>
    );
}


export default Job;