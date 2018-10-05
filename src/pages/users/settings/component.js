import React from 'react';
import { Grid, Tabs, Tab } from '@material-ui/core';
import { FormattedMessage } from 'react-intl'
import Settings from './components/settings';
import Jobs from './components/jobs';
import Following from './components/following';
// import Notifications from './components/notifications';
// import Following from './components/following';
import Loader from '../../../components/Loader';

const UserSettings = props => {
    const { handleTabChange, activeTab, currentProfileQuery: { loading } } = props;

    if (loading)
        return <Loader />

    return (
        <div className='userSettingsRoot'>
            <Grid container className='header'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <FormattedMessage id="users.settingsTitle" defaultMessage="My \nprofile" description="My profile">
                        {(text) => (
                            <h1 className='settingsTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h1>
                        )}
                    </FormattedMessage>
                    <FormattedMessage id="users.settingsMessage" defaultMessage="" description="Setting Message">
                        {(text) => (
                            <p className='settingsMessage'>{text}</p>
                        )}
                    </FormattedMessage>
                    
                </Grid>
            </Grid>
            <Grid container className='mainBody userSettings'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <FormattedMessage id="users.tabs" defaultMessage="Settings\nNotifications\nJobs I applied to\nFollowing" description="Users Tabs">
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
                                <Tab
                                    label={text.split("\n")[3]}
                                    value='following'
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
                    {activeTab === 'following' && <Following {...props} />}
                </Grid>
            </Grid>
        </div>
    )
};

export default UserSettings;