import React from 'react';
import { Grid, TextField, Checkbox, Button } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl'

import Company from './components/company';
import Loader from '../../../components/Loader';

const CompaniesList = props => {
    const { handleFormChange, formData, companiesQuery } = props;
    const { loading } = companiesQuery;
    const { isStartup, isCorporation, isBoutique, isMultinational } = formData;

    if (loading) {
        return <Loader />
    } else {
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
                        loader={<Loader />}
                        useWindow={true}
                    >
                        {companies.map(company => (<Company company={company} key={company.id} {...props} />))}
                    </InfiniteScroll>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                            
                    <div className='columnRightContent'>
                        <FormattedMessage id="company.list.findCompany" defaultMessage="Find \ncompany" description="Find company">
                            {(text) => (
                                 <h2 className="columnTitle">
                                    {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                                </h2>
                            )}
                        </FormattedMessage>
                       
                        <div className='filters'>
                            
                            <FormattedMessage id="company.list.searchFilters" defaultMessage="Company\nSearch company...\nCity\nFind city...\nIndustry\nFind industry...\nTeam\nFind team..." description="Search Filters">
                                {(text) => (
                                    <section className='advanced'>
                                        <TextField
                                            name='company'
                                            label={text.split("\n")[0]}
                                            placeholder={text.split("\n")[1]}
                                            type="search"
                                            className='textField'
                                        />
                                        <TextField
                                            name='city'
                                            label={text.split("\n")[2]}
                                            placeholder={text.split("\n")[3]}
                                            type="search"
                                            className='textField'
                                        />
                                        <TextField
                                            name='industry'
                                            label={text.split("\n")[4]}
                                            placeholder={text.split("\n")[5]}
                                            type="search"
                                            className='textField'
                                        />
                                        <TextField
                                            name='team'
                                            label={text.split("\n")[6]}
                                            placeholder={text.split("\n")[7]}
                                            type="search"
                                            className='textField'
                                        />
                                    </section>
                                )}
                            </FormattedMessage>
                                
                            
                            <section className='companyType'>
                                <p className='sectionTitle'>Company type</p>
                                <label htmlFor="isStartup">
                                    <Checkbox
                                        id='isStartup'
                                        name='isStartup'
                                        checked={isStartup}
                                        onChange={handleFormChange}
                                        className='hiddenInput'
                                    />
                                    <FormattedMessage id="company.list.startUp" defaultMessage="Startup" description="Startup">
                                        {(text) => (
                                            <Button component='span' className={isStartup ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                    
                                </label>
                                <label htmlFor="isCorporation">
                                    <Checkbox
                                        id='isCorporation'
                                        name='isCorporation'
                                        checked={isCorporation}
                                        onChange={handleFormChange}
                                        className='hiddenInput'
                                    />
                                    <FormattedMessage id="company.list.corporation" defaultMessage="Corporation" description="Corporation">
                                        {(text) => (
                                            <Button component='span' className={isCorporation ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                    
                                </label>
                                <label htmlFor="isBoutique">
                                    <Checkbox
                                        id='isBoutique'
                                        name='isBoutique'
                                        checked={isBoutique}
                                        onChange={handleFormChange}
                                        className='hiddenInput'
                                    />
                                    <FormattedMessage id="company.list.boutique" defaultMessage="Boutique" description="Boutique">
                                        {(text) => (
                                            <Button component='span' className={isBoutique ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                    
                                </label>
                                <label htmlFor="isMultinational">
                                    <Checkbox
                                        id='isMultinational'
                                        name='isMultinational'
                                        checked={isMultinational}
                                        onChange={handleFormChange}
                                        className='hiddenInput'
                                    />
                                    <FormattedMessage id="company.list.multinational" defaultMessage="Multinational" description="Multinational">
                                        {(text) => (
                                            <Button component='span' className={isMultinational ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                    
                                </label>
                            </section>
                        </div>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default CompaniesList;