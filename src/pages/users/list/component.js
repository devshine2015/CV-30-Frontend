import React from 'react';
import { Grid, TextField, Button, Checkbox, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import { FormattedMessage } from 'react-intl'
import Profile from './components/profile';
import Loader from '../../../components/Loader';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);


const UsersList = props => {
    const {
        profilesQuery,
        handleFormChange, handleSliderChange, toggleIsProfileVerified, formData: { isHighSchool, isUniversity, isMasters, isDoctorate, isProfileVerified }
    } = props;

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
                        {profiles.map(user => <Profile user={user} key={user.id} />)}
                    </InfiniteScroll>
                    : <Loader />
                }
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <FormattedMessage id="users.findPeople" defaultMessage="Find \npeople" description="Find people">
                        {(text) => (
                            <h2 className="columnTitle">
                                {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                            </h2>
                        )}
                    </FormattedMessage>
                    
                    <div className='filters'>
                        <FormattedMessage id="users.searchFitlers" defaultMessage="Name\nSearch by name...\nCity\nSearch by city...\nHard skills\nSearch by hard skills...\nSoft skills\nSearch by soft skills...\nCompany\nSearch by company..." description="User Search Filters">
                            {(text) => (
                                <section className='advanced'>
                                    <TextField
                                        name='name'
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
                                        name='hSkill'
                                        label={text.split("\n")[4]}
                                        placeholder={text.split("\n")[5]}
                                        type="search"
                                        className='textField'
                                    />
                                    <TextField
                                        name='sSkill'
                                        label={text.split("\n")[6]}
                                        placeholder={text.split("\n")[7]}
                                        type="search"
                                        className='textField'
                                    />
                                    <TextField
                                        name='company'
                                        label={text.split("\n")[8]}
                                        placeholder={text.split("\n")[9]}
                                        type="search"
                                        className='textField'
                                    />
                                </section>
                            )}
                        </FormattedMessage>
                        

                        <section className='educationType'>
                            <p className='sectionTitle'>Education</p>
                            <label htmlFor="isHighSchool">
                                <Checkbox
                                    id='isHighSchool'
                                    name='isHighSchool'
                                    checked={isHighSchool}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.highschool" defaultMessage="HighSchool" description="HighSchool">
                                    {(text) => (
                                        <Button component='span' className={isHighSchool ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isUniversity">
                                <Checkbox
                                    id='isUniversity'
                                    name='isUniversity'
                                    checked={isUniversity}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.university" defaultMessage="University" description="University">
                                    {(text) => (
                                        <Button component='span' className={isUniversity ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isMasters">
                                <Checkbox
                                    id='isMasters'
                                    name='isMasters'
                                    checked={isMasters}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.master" defaultMessage="Master's Degree" description="Master's Degree">
                                    {(text) => (
                                        <Button component='span' className={isMasters ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isDoctorate">
                                <Checkbox
                                    id='isDoctorate'
                                    name='isDoctorate'
                                    checked={isDoctorate}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.doctor" defaultMessage="Doctorate Degree" description="Doctorate Degree">
                                    {(text) => (
                                        <Button component='span' className={isDoctorate ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                        </section>
                        <section className='endorsment'>
                            <FormattedMessage id="users.endorsmentLevel" defaultMessage="Endorsment level" description="Endorsment level">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
                            <Range min={100} max={300} defaultValue={[100, 300]} step={10} onChange={handleSliderChange} />
                        </section>
                        <section className='verifiedProfile'>
                            <FormattedMessage id="nav.profile" defaultMessage="Profile" description="Profile">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
                            <FormGroup row className='profileToggle'>
                                <FormattedMessage id="users.verified" defaultMessage="Verified" description="Verified">
                                    {(text) => (
                                         <FormLabel className={isProfileVerified ? 'active' : ''}>{text}</FormLabel>
                                    )}
                                </FormattedMessage>
                               
                                <ToggleSwitch checked={isProfileVerified} onChange={toggleIsProfileVerified}
                                    classes={{
                                        switchBase: 'colorSwitchBase',
                                        checked: 'colorChecked',
                                        bar: 'colorBar',
                                    }}
                                    color="primary" />
                                <FormattedMessage id="users.notVerified" defaultMessage="Not verified" description="Not verified">
                                    {(text) => (
                                        <FormLabel className={!isProfileVerified ? 'active' : ''}>{text}</FormLabel>
                                    )}
                                </FormattedMessage>
                                
                            </FormGroup>
                        </section>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default UsersList;