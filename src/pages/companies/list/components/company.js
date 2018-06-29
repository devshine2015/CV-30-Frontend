import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Avatar, Chip, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import JobItem from './jobItem';
import TeamMember from './teamMember';

const CompanyHOC = compose(
    withState('activeTab', 'setActiveTab', false),
    withHandlers({
        handleTabChange: ({ activeTab, setActiveTab }) => (event, value) => {
            setActiveTab(activeTab === value ? false : value);
        }
    }),
    pure);


const Company = props => {
    const {
        activeTab, handleTabChange,
        name, field, description, jobs, location, team, employees
    } = props;
    return (
        <div className='listItem companyListItem'>
            <div className='leftOverlay'>
                <Link to='/dashboard/company'>
                    <Avatar alt="Gabriel" src="http://brandmark.io/logo-rank/random/pepsi.png" className='avatar' />
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
                {location}&nbsp;|&nbsp;{employees}
            </div>
            <div className='itemBody'>
                <p className='companyDescription'>
                    {description}
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