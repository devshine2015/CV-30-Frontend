import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import JobItem from './jobItem';
import { defaultCompanyLogo, stripHtmlTags } from '../../../../constants/utils';
import { s3BucketURL } from '../../../../constants/s3';

const CompanyHOC = compose(
    withState('activeTab', 'setActiveTab', false),
    withHandlers({
        handleTabChange: ({ activeTab, setActiveTab }) => (event, value) => {
            setActiveTab(activeTab === value ? false : value);
        }
    }),
    pure);


const Company = props => {
    const { activeTab, handleTabChange, company, match: { params: { lang } } } = props;
    const { id, name, industry, location, noOfEmployees, description, jobs, teams, logoPath } = company;
    let avatar =
        logoPath ? `${s3BucketURL}${logoPath}` : defaultCompanyLogo;

    return (
        <div className='listItem companyListItem'>
            <div className='leftOverlay'>
                <Link to={`/${lang}/company/${id}`}>
                    <Avatar alt={name} src={avatar} className='avatar' />
                </Link>
                <Link to={`/${lang}/company/${id}`} style={{ textDecoration: 'none' }}>
                    <div className='leftOverlayTexts'>
                        <h6 className='userName'>
                            {name}
                            <i className='fas fa-caret-down' />
                        </h6>
                        <p className='userTitle'>{industry && industry.title}</p>
                    </div>
                </Link>
            </div>
            <div className='rightOverlay'>
                {location}&nbsp;|&nbsp;{noOfEmployees || 0} Employees
            </div>
            <div className='itemBody'>
                <p className='companyDescription'>
                    {stripHtmlTags(description)}
                </p>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    classes={{
                        root: 'tabsContainer',
                        indicator: 'tabsIndicator'
                    }}
                >
                    <Tab
                        label="Jobs"
                        value='jobs'
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
                        disabled={!jobs || jobs.length === 0}
                    />
                    <Tab
                        label="Teams"
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
                </Tabs>
            </div>
            <div className={activeTab ? 'itemFooter open' : 'itemFooter'}>
                {activeTab === 'jobs' &&
                    <div className='jobs'>
                        {jobs.map((job, index) => <JobItem job={job} key={`job-${index}`} />)}
                    </div>
                }
                {
                    activeTab === 'team' &&
                    <div className='team'>
                        {/* {team.map((member, index) => (<TeamMember {...member} key={`member-${index}`} />))} */}
                    </div>
                }
            </div>
        </div>
    );
}

export default CompanyHOC(Company);