import React from 'react';
import { Grid, Tabs, Tab } from '@material-ui/core';
import { FormattedMessage } from 'react-intl'

import Settings from './components/settings';
import Jobs from './components/jobs';
import Loader from '../../../components/Loader';

// import Notifications from './components/notifications';
// import Following from './components/following';

const CompanySettings = props => {
    const { handleTabChange, activeTab, currentCompany: { loading } } = props;

    if (loading)
        return <Loader />

    return (
        <div className='companySettingsRoot'>
            <Grid container className='header'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <FormattedMessage id="company.settings.settingTitle" defaultMessage="My \ncompany" description="My company">
                        {(text) => (
                            <h1 className='settingsTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h1>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="company.settings.settingsMessage" defaultMessage="" description="Settings Message">
                        {(text) => (
                            <p className='settingsMessage'>{text}</p>
                        )}
                    </FormattedMessage>
                    
                </Grid>
            </Grid>
            <Grid container className='mainBody companySettings'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <FormattedMessage id="company.settings.tabs" defaultMessage="Settings\nNotifications\nCompany jobs" description="Settings Notifications Company jobs">
                        {(text) => (
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                classes={{
                                    root: 'tabsContainer',
                                    indicator: 'tabIndicator'
                                }}
                            >
                                <Tab
                                    label={text.split("\n")[0]}
                                    value='settings'
                                    classes={{
                                        root: 'tabItemRoot',
                                        selected: 'tabItemSelected'
                                    }}
                                />
                                <Tab
                                    label={text.split("\n")[1]}
                                    value='notifications'
                                    classes={{
                                        root: 'tabItemRoot',
                                        selected: 'tabItemSelected'
                                    }}
                                />
                                <Tab
                                    label={text.split("\n")[2]}
                                    value='jobs'
                                    classes={{
                                        root: 'tabItemRoot',
                                        selected: 'tabItemSelected'
                                    }}
                                />
                            </Tabs>
                        )}
                    </FormattedMessage>
                    
                    {activeTab === 'settings' && <Settings {...props} />}
                    {activeTab === 'jobs' && <Jobs {...props} />}
                </Grid>
            </Grid>
        </div>
    )
};

export default CompanySettings;