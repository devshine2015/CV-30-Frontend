import React from 'react';

import { compose, withState, pure } from 'recompose';
import { graphql } from 'react-apollo';

import InfiniteScroll from 'react-infinite-scroller';
import { Select, MenuItem } from '@material-ui/core';

import { getJobsQuery } from '../../../../store/queries';
import { JobItem } from '../../../jobs/list/components';
import Loader from '../../../../components/Loader';

const JobsListHOC = compose(
    withState('state', 'setState', {
        status: 'active'
    }),
    graphql(getJobsQuery, {
        name: 'companyJobsQuery',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                filter: {
                    companyId: props.match.params.companyId,
                    status: props.state.status,
                },
                first: 10
            },
            fetchPolicy: 'network-only'
        }),
    }),
    pure
)

const JobsList = props => {
    const { companyJobsQuery, currentCompany: { company }, editJob, state, setState, match: { params: { lang } } } = props;

    const jobs = companyJobsQuery.jobs ? companyJobsQuery.jobs.edges.map(edge => edge.node) : [];
    const hasNextPage = companyJobsQuery.jobs ? companyJobsQuery.jobs.pageInfo.hasNextPage : false;

    return (
        <React.Fragment>
            <Select
                onChange={(event) => setState({ ...state, status: event.target.value})}
                value={state.status}
            >
                <MenuItem value="" disabled>
                    <em>Select status</em>
                </MenuItem>
                {
                    ['Active', 'Draft', 'Archived'].map(item => <MenuItem value={item.toLowerCase()} key={item}>{item}</MenuItem>)
                }

            </Select>
            {(jobs.length > 0) ?
                <div className='jobsList'>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() =>
                            companyJobsQuery.fetchMore({
                                variables: {
                                    after: companyJobsQuery.jobs.edges[companyJobsQuery.jobs.edges.length - 1].cursor
                                },
                                updateQuery: (previousResult, { fetchMoreResult: { jobs: { edges: newEdges, pageInfo} } }) => {
                                    return newEdges.length
                                        ? {
                                            // Put the new jobs at the end of the list and update `pageInfo`
                                            jobs: {
                                                __typename: previousResult.jobs.__typename,
                                                edges: [...previousResult.jobs.edges, ...newEdges],
                                                pageInfo
                                            }
                                        }
                                        : previousResult;
                                }
                            })}
                        hasMore={hasNextPage}
                        loader={<Loader  key='loader'/>}
                        useWindow={true}
                    >
                        {jobs.map(job => (
                            <JobItem
                                key={job.id}
                                company={company}
                                job={{
                                    ...job,
                                    company
                                }}
                                editJob={editJob}
                                lang={lang}
                            />))
                        }
                    </InfiniteScroll>
                </div>
                :
                <p className='noJobs'>No jobs</p>
            }
        </React.Fragment>
    );
}

export default JobsListHOC(JobsList);