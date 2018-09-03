import React from 'react';
import Show from './components/show';
import Edit from './components/edit';
import Loader from '../../../components/Loader';
import EditToggle from '../../../components/EditToggle';

const Job = props => {
    const {
        getEditMode: { editMode: { status: editMode } },
        getJobQuery: { loading, job },
        currentUser: { loading: currentUserLoading, auth: { currentUser } }
    } = props;

    if (loading || currentUserLoading)
        return <Loader />

    const { id: userId } = currentUser || {};
    
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