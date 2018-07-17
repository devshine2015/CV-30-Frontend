import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import JobItem from '../../../jobs/list/components/jobItem';
import { getJobsQuery } from '../../../../store/queries';

const JobListHOC = compose(
    withRouter,
    graphql(getJobsQuery, {
        name: 'getJobsQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
);

const JobsList = props => {
    const { getJobsQuery: { jobs } } = props;
    return (
        <div className='jobsList'>
            {jobs.map((job, index) => (<JobItem {...job} key={job.id} />))}
        </div>
    );
}

export default JobListHOC(JobsList);