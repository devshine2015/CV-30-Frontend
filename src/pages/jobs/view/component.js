import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import Show from './components/show';
import Edit from './components/edit';
import Loader from '../../../components/Loader';
import EditToggle from '../../../components/EditToggle';

const Job = props => {
    const {
        getEditMode: { editMode: { status: editMode } },
        getJobQuery: { loading, job },
        currentUser: { auth: { currentUser: { id: userId } } }
    } = props;

    if (loading)
        return <Loader />

    return (
        <div className='jobRoot'>
            {(job.company.owner.id === userId) &&
                <EditToggle />
            }
            {editMode ?
                <Edit {...props} />
                : <Show {...props} />
            }
        </div>
    );
}


export default Job;