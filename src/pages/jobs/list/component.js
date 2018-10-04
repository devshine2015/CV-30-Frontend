import React from 'react';
import { Grid, Button, TextField, Hidden, InputAdornment, Checkbox } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import Slider from 'rc-slider';
import { FormattedMessage } from 'react-intl'
import 'rc-slider/assets/index.css';
import JobItem from './components/jobItem';
import Loader from '../../../components/Loader';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const JobsList = props => {
    const { getJobsQuery } = props;
    const { loading } = getJobsQuery;

    if (loading) {
        return <Loader />
    } else {
        const jobs = getJobsQuery.jobs ? getJobsQuery.jobs.edges.map(edge => edge.node) : [];
        const hasNextPage = getJobsQuery.jobs ? getJobsQuery.jobs.pageInfo.hasNextPage : false;
        console.log("----------------- Job page jobs -----------------------", jobs)
        const { formData, handleFormChange, handleSearchJobs, match: { params: { lang }} } = props;
        const { jobName, company, location, isPartTime, isFullTime, isProjectBased, isRemote, isStartup, isCorporation, isBoutique, isMultinational, handleSliderChange } = formData;
        return (
            <div className='jobsListRoot'>
                <Grid container className='header'>
                    <Grid item lg={6} md={12} sm={12} xs={12} className='centralColumn'>
                        <FormattedMessage id="jobs.list.searchJobs" defaultMessage="Search \njobs" description="Search jobs">
                            {(text) => (
                                <h1 className='searchTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h1>
                            )}
                        </FormattedMessage>
                        
                        <div className='searchFields'>
                            <FormattedMessage id="jobs.list.title" defaultMessage="Job title..." description="Job title">
                                {(text) => (
                                    <TextField
                                        name='jobName'
                                        value={jobName || ''}
                                        onChange={handleFormChange}
                                        label={text}
                                        type="search"
                                        className='textField'
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><i className='fas fa-briefcase' /></InputAdornment>,
                                        }}
                                    />
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.list.location" defaultMessage="Location..." description="Location">
                                {(text) => (
                                    <TextField
                                        name='location'
                                        value={location || ''}
                                        onChange={handleFormChange}
                                        label={text}
                                        type="search"
                                        className='textField'
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><i className='fas fa-map-marker-alt' /></InputAdornment>,
                                        }}
                                    />
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.list.searchBtn" defaultMessage="Search" description="Search">
                                {(text) => (
                                    <Button className='searchBtn' onClick={handleSearchJobs}>
                                        {text}
                                    </Button>
                                )}
                            </FormattedMessage>
                            
                        </div>
                    </Grid>
                    <Hidden mdDown>
                        <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
                    </Hidden>
                </Grid>
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
                            loader={<Loader />}
                            useWindow={true}
                        >
                            {jobs.map((job, index) => (<JobItem job={job} lang={lang} key={`job-${index}`} />))}
                        </InfiniteScroll>
                    </Grid>
                    <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                        <div className='columnRightContent'>
                            <FormattedMessage id="jobs.list.filterJobs" defaultMessage="Filter \njobs" description="Filter jobs">
                                {(text) => (
                                    <h2 className="columnTitle">
                                        {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                                    </h2>
                                )}
                            </FormattedMessage>
                            
                            <div className='filters'>
                                <FormattedMessage id="jobs.list.searchCompany" defaultMessage="Company\nSearch for company..." description="Search for company">
                                    {(text) => (
                                        <TextField
                                            name='company'
                                            value={company || ''}
                                            label={text.split("\n")[0]}
                                            placeholder={text.split("\n")[1]}
                                            type="search"
                                            className='textField'
                                        />
                                    )}
                                </FormattedMessage>
                                
                                <section className='jobType'>
                                    <p className='sectionTitle'>Job type</p>
                                    <label htmlFor="isPartTime">
                                        <Checkbox
                                            id='isPartTime'
                                            name='isPartTime'
                                            checked={isPartTime}
                                            onChange={handleFormChange}
                                            className='hiddenInput'
                                        />
                                        <FormattedMessage id="jobs.partTime" defaultMessage="Part time" description="Part time">
                                            {(text) => (
                                                <Button component='span' className={isPartTime ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                    {text}
                                                </Button>
                                            )}
                                        </FormattedMessage>
                                        
                                    </label>
                                    <label htmlFor="isFullTime">
                                        <Checkbox
                                            id='isFullTime'
                                            name='isFullTime'
                                            checked={isFullTime}
                                            onChange={handleFormChange}
                                            className='hiddenInput'
                                        />
                                        <FormattedMessage id="jobs.fullTime" defaultMessage="Full time" description="Full time">
                                            {(text) => (
                                                <Button component='span' className={isFullTime ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                    {text}
                                                </Button>
                                            )}
                                        </FormattedMessage>
                                        
                                    </label>
                                    <label htmlFor="isProjectBased">
                                        <Checkbox
                                            id='isProjectBased'
                                            name='isProjectBased'
                                            checked={isProjectBased}
                                            onChange={handleFormChange}
                                            className='hiddenInput'
                                        />
                                        <FormattedMessage id="jobs.projectBased" defaultMessage="Project based" description="Project based">
                                            {(text) => (
                                                <Button component='span' className={isProjectBased ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                    {text}
                                                </Button>
                                            )}
                                        </FormattedMessage>
                                        
                                    </label>
                                    <label htmlFor="isRemote">
                                        <Checkbox
                                            id='isRemote'
                                            name='isRemote'
                                            checked={isRemote}
                                            onChange={handleFormChange}
                                            className='hiddenInput'
                                        />
                                        <FormattedMessage id="jobs.remote" defaultMessage="Remote" description="Remote">
                                            {(text) => (
                                                 <Button component='span' className={isRemote ? 'checkboxBtn active' : 'checkboxBtn'}>
                                                    {text}
                                                </Button>
                                            )}
                                        </FormattedMessage>
                                       
                                    </label>
                                </section>
                                <section className='compensation'>
                                    <FormattedMessage id="jobs.list.compensation" defaultMessage="Compensation" description="Compensation">
                                        {(text) => (
                                            <p className='sectionTitle'>{text}</p>
                                        )}
                                    </FormattedMessage>
                                    
                                    <Range min={0} max={3000} defaultValue={[0, 1000]} tipFormatter={value => `${value}E`} step={10} onChange={handleSliderChange} />
                                </section>
                                <section className='matching'>
                                    <FormattedMessage id="jobs.list.match" defaultMessage="Match" description="Match">
                                        {(text) => (
                                            <p className='sectionTitle'>{text}</p>
                                        )}
                                    </FormattedMessage>
                                    
                                    <Range min={0} max={100} defaultValue={[25, 75]} tipFormatter={value => `${value}%`} step={1} onChange={handleSliderChange} />
                                </section>
                                <section className='advanced'>
                                    <FormattedMessage id="jobs.list.advancedSearch" defaultMessage="Advanced search" description="Advanced search">
                                        {(text) => (
                                            <p className='sectionTitle'>{text}</p>
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage id="jobs.searchSkills" defaultMessage="Skills\nSearch skill..." description="Search skill">
                                        {(text) => (
                                            <TextField
                                                name='skills'
                                                label={text.split("\n")[0]}
                                                placeholder={text.split("\n")[1]}
                                                type="search"
                                                className='textField'
                                            />
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage id="jobs.searchBenefits" defaultMessage="Benefits\nSearch benefits..." description="">
                                        {(text) => (
                                            <TextField
                                                name='benefits'
                                                label={text.split("\n")[0]}
                                                placeholder={text.split("\n")[1]}
                                                type="search"
                                                className='textField'
                                            />
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage id="jobs.searchTeam" defaultMessage="Team\nSearch teams..." description="Search teams">
                                        {(text) => (
                                            <TextField
                                                name='team'
                                                label={text.split("\n")[0]}
                                                placeholder={text.split("\n")[1]}
                                                type="search"
                                                className='textField'
                                            />
                                        )}
                                    </FormattedMessage>
                                    <FormattedMessage id="jobs.searchIndustry" defaultMessage="Industry\nSearch industries..." description="Search industries">
                                        {(text) => (
                                            <TextField
                                                name='industry'
                                                label={text.split("\n")[0]}
                                                placeholder={text.split("\n")[1]}
                                                type="search"
                                                className='textField'
                                            />
                                        )}
                                    </FormattedMessage>
                                    
                                </section>
                                <section className='companyType'>
                                    <FormattedMessage id="jobs.companyType" defaultMessage="Company type" description="Company type">
                                        {(text) => (
                                            <p className='sectionTitle'>{text}</p>
                                        )}
                                    </FormattedMessage>
                                    
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
            </div>
        )
    }
}

export default JobsList;