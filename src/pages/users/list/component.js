import React from 'react';
import { Grid } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';

import { ProfileItem, ProfilesFilter } from './components';
import Loader from '../../../components/Loader';

const UsersList = props => {
    const { profilesQuery, setSearchData, searchData } = props;
    const profiles = profilesQuery.profiles ? profilesQuery.profiles.edges.map(edge => edge.node) : [];
    const hasNextPage = profilesQuery.profiles ? profilesQuery.profiles.pageInfo.hasNextPage : false;

    return (
        <Grid container className='mainBody userListRoot'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                { !profilesQuery.loading
                    ? <InfiniteScroll
                        pageStart={0}
                        loadMore={() =>
                            profilesQuery.fetchMore({
                                variables: {
                                    after: profilesQuery.profiles.edges[profilesQuery.profiles.edges.length - 1].cursor
                                },
                                updateQuery: (previousResult, { fetchMoreResult: { profiles: { edges: newEdges, pageInfo} } }) => {
                                    return newEdges.length
                                        ? {
                                            // Put the new profiles at the end of the list and update `pageInfo`
                                            profiles: {
                                                __typename: previousResult.profiles.__typename,
                                                edges: [...previousResult.profiles.edges, ...newEdges],
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
                        {profiles.map(user => <ProfileItem user={user} key={user.id} />)}
                    </InfiniteScroll>
                    : <Loader />
                }
            </Grid>
            <ProfilesFilter onFilterChange={value => setSearchData({...searchData, ...value})}/>
        </Grid>
    );
}

export default UsersList;