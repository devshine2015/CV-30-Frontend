import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import JobItem from './jobItem';
import TeamMember from './teamMember';
import { defaultCompanyLogo } from '../../../../constants/utils';

const CompanyHOC = compose(
    withState('activeTab', 'setActiveTab', false),
    withHandlers({
        handleTabChange: ({ activeTab, setActiveTab }) => (event, value) => {
            setActiveTab(activeTab === value ? false : value);
        }
    }),
    pure);


const Company = props => {
    const { activeTab, handleTabChange, company,match: {params: {lang}} } = props;
    const { id, name, field, location, noOfEmployees, i18n, jobs, team } = company;

    return (
        <div className='listItem companyListItem'>
            <div className='leftOverlay'>
                <Link to={`/${lang}/company/${id}`}>
                    <Avatar alt="Gabriel" src={defaultCompanyLogo} className='avatar' style={{ backgroundColor: '#fff', margin: 3 }} imgProps={{ style: { objectFit: 'contain' } }} />
                </Link>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        {name}
                        <i className='fas fa-caret-down' />
                    </h6>
                    <p className='userTitle'>{field}</p>
                </div>
            </div>
            <div className='rightOverlay'>
                {location}&nbsp;|&nbsp;{noOfEmployees || 0} Employees
            </div>
            <div className='itemBody'>
                <p className='companyDescription'>
                    {i18n[0].description}
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
                        label="Team"
                        value='team'
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
                        disabled={!team || team.length === 0}
                    />
                </Tabs>
            </div>
            <div className={activeTab ? 'itemFooter open' : 'itemFooter'}>
                {activeTab === 'jobs' &&
                    <div className='jobs'>
                        {jobs.map((job, index) => <JobItem {...job} key={`job-${index}`} />)}
                    </div>
                }
                {
                    activeTab === 'team' &&
                    <div className='team'>
                        {team.map((member, index) => (<TeamMember {...member} key={`member-${index}`} />))}
                    </div>
                }
            </div>
        </div>
    );
}

export default CompanyHOC(Company);