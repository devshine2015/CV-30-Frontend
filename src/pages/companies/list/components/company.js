import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { defaultCompanyLogo, stripHtmlTags } from '../../../../constants/utils';
import { s3BucketURL } from '../../../../constants/s3';
import JobsSlider from './jobsSlider';
import TeamsSlider from './teamsSlider'
import TeamMember from './teamMember'

const CompanyHOC = compose(
    withState('activeTab', 'setActiveTab', false),
    withHandlers({
        handleTabChange: ({ activeTab, setActiveTab }) => (event, value) => {
            setActiveTab(activeTab === value ? false : value);
        }
    }),
    pure);

const Company = ({ activeTab, handleTabChange,
    company: { id, name, industry, location, noOfEmployees, description, recentJobs, teams, logoPath },
    match: { params: { lang } } }) => (
        <div className='listItem companyListItem'>
            <div className='leftOverlay'>
                <Link to={`/${lang}/company/${id}`}>
                    <Avatar alt={name} src={logoPath ? `${s3BucketURL}${logoPath}` : defaultCompanyLogo} className='avatar' />
                </Link>
                <Link to={`/${lang}/company/${id}`} style={{ textDecoration: 'none' }}>
                    <div className='leftOverlayTexts'>
                        <h6 className='userName'>
                            {name}
                            <i className='fas fa-caret-down' />
                        </h6>
                        { industry &&
                        (<FormattedMessage id={`industries.${industry.key}`} defaultMessage={industry.key}>
                            {(text) => (
                                <p className='userTitle'>{text}</p>
                            )}
                        </FormattedMessage>)
                        }
                    </div>
                </Link>
            </div>
            
            <FormattedMessage id="company.list.employees" defaultMessage="Employees" description="Employees">
                {(text) => (
                    <div className='rightOverlay'>
                        {location}&nbsp;|&nbsp;{noOfEmployees || 0} {text}
                    </div>
                )}
            </FormattedMessage> 
                
            <div className='itemBody'>
                <p className='companyDescription'>
                    {stripHtmlTags(description)}
                </p>
                <FormattedMessage id="company.list.tabs" defaultMessage="Jobs0Teams" description="Jobs Teams">
                    {(text) => (
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            classes={{
                                root: 'tabsContainer',
                                indicator: 'tabsIndicator'
                            }}
                        >   
                            {
                                (recentJobs && recentJobs.length !== 0) &&
                                <Tab
                                    label={text.split("0")[0]}
                                    value='jobs'
                                    classes={{
                                        root: 'tabRoot',
                                        labelIcon: 'labelIcon',
                                        selected: 'tabSelected',
                                        wrapper: 'tabWrapper',
                                        labelContainer: 'labelContainer',
                                        label: 'label',
                                    }}
                                    disableRipple
                                    disableTouchRipple
                                    focusRipple
                                    disabled={!recentJobs || recentJobs.length === 0}
                                />
                            }
                            {
                                
                                (teams && teams.length !== 0) && 
                                <Tab
                                    label={text.split("0")[1]}
                                    value='teams'
                                    classes={{
                                        root: 'tabRoot',
                                        labelIcon: 'labelIcon',
                                        selected: 'tabSelected',
                                        wrapper: 'tabWrapper',
                                        labelContainer: 'labelContainer',
                                        label: 'label'
                                    }}
                                    disableRipple
                                    disableTouchRipple
                                    focusRipple
                                    disabled={!teams || teams.length === 0}
                                />
                            }
                            
                        </Tabs>
                    )}
                </FormattedMessage>
                
            </div>
            <div className={activeTab ? 'itemFooter open' : 'itemFooter'}>
                {console.log(teams)}
                {   activeTab === 'jobs' &&
                    <JobsSlider jobs={recentJobs} />
                }
                {
                    activeTab === 'teams' &&
                    <TeamsSlider teams={teams} />
                }
            </div>
        </div>
    );

export const CompanyItem = CompanyHOC(Company);