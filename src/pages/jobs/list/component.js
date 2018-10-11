import React from 'react';
import { Grid } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';

import Loader from '../../../components/Loader';
import { JobItem, JobsFilter, JobsSearch } from './components';

const JobsList = props => {
    console.log(props);
    const { getJobsQuery } = props;

    const jobs = getJobsQuery && getJobsQuery.jobs ? getJobsQuery.jobs.edges.map(edge => edge.node) : [];
    const hasNextPage = getJobsQuery.jobs ? getJobsQuery.jobs.pageInfo.hasNextPage : false;
    console.log("----------------- Job page jobs -----------------------", jobs)
    const { setSearchData, searchData, match: { params: { lang }} } = props;
        
    return (
        <div className='jobsListRoot'>
            <JobsSearch onSearch={value => setSearchData({...searchData, ...value})} />
            <Grid container className='mainBody jobsList'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() =>
                            getJobsQuery.fetchMore({
                                variables: {
                                    after: getJobsQuery.jobs.edges[getJobsQuery.jobs.edges.length - 1].cursor
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
                        loader={<Loader key='loader'/>}
                        useWindow={true}
                    >
                        {jobs.map((job, index) => (<JobItem job={job} lang={lang} key={`job-${index}`} />))}
                    </InfiniteScroll>
                </Grid>
                <JobsFilter onFilterChange={value => setSearchData({...searchData, ...value})}/>
            </Grid>
        </div>
    );
}

export default JobsList;