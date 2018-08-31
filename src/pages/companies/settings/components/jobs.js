import React from 'react';

import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import JobItem from '../../../jobs/list/components/jobItem';
import { getJobsQuery } from '../../../../store/queries';
import Loader from '../../../../components/Loader';

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
    //console.log(props);
    const { currentCompany: { company }} = props;
    const { jobs } = company;
    // const { getJobsQuery: { loading, jobs } } = props;
    // if (loading)
    //     return <Loader />
    return (
        <div className='jobsList'>
            {jobs && jobs.map(job => (
                <JobItem
                    key={job.id} 
                    company={company}
                    job={job}
                />))}
        </div>
    );
}

export default JobsList;