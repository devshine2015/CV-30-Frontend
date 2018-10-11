import React from 'react';

import { JobItem } from '../../../jobs/list/components';

const JobsList = props => {
    const { 
        currentProfileQuery: { profile },
        match: { params: { lang }}
    } = props;
    const { appliedJobs: jobs } = profile || {};

    return (
        <div className='jobsList'>
            {jobs && jobs.map(job => (<JobItem job={job} lang={lang} key={job.id} />))}
        </div>
    );
}

export default JobsList;