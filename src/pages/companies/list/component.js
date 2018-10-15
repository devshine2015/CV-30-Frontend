import React from 'react';
import { Grid } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';

import { CompanyItem, CompaniesFilter } from './components';
import Loader from '../../../components/Loader';

const CompaniesList = props => {
    const { companiesQuery, setSearchData, searchData } = props;
    const companies = companiesQuery.companies ? companiesQuery.companies.edges.map(edge => edge.node) : [];
    const hasNextPage = companiesQuery.companies ? companiesQuery.companies.pageInfo.hasNextPage : false;
    return (
        <Grid container className='mainBody companiesListRoot'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() =>
                        companiesQuery.fetchMore({
                            variables: {
                                after: companiesQuery.companies.edges[companiesQuery.companies.edges.length - 1].cursor
                            },
                            updateQuery: (previousResult, { fetchMoreResult: { companies: { edges: newEdges, pageInfo} } }) => {
                                return newEdges.length
                                    ? {
                                        // Put the new companies at the end of the list and update `pageInfo`
                                        companies: {
                                            __typename: previousResult.companies.__typename,
                                            edges: [...previousResult.companies.edges, ...newEdges],
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
                    {companies.map(company => (<CompanyItem company={company} key={company.id} {...props} />))}
                </InfiniteScroll>
            </Grid>
            <CompaniesFilter onFilterChange={value => setSearchData({...searchData, ...value})}/>
        </Grid>
    );
}

export default CompaniesList;