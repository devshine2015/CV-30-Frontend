import React from 'react';
import { Grid, Tabs, Tab } from '@material-ui/core';

import Settings from './components/settings';
import Jobs from './components/jobs';
// import Notifications from './components/notifications';
// import Following from './components/following';
import Loader from '../../../components/Loader';;

const UserSettings = props => {
    const { handleTabChange, activeTab, currentProfileQuery: { loading } } = props;

    if (loading)
        return <Loader />

    return (
        <div className='userSettingsRoot'>
            <Grid container className='header'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <h1 className='settingsTitle'>My <b>profile</b></h1>
                    <p className='settingsMessage'>Ut odio stet vis. Et nec perfecto delicata. Hendrerit disputando et usu. Vel no facilis sadipscing, omnis fierent ullamcorper eu est.</p>
                </Grid>
            </Grid>
            <Grid container className='mainBody userSettings'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        classes={{
                            root: 'tabsContainer',
                            indicator: 'tabIndicator'
                        }}
                    >
                        <Tab
                            label="Settings"
                            value='settings'
                            classes={{
                                root: 'tabItemRoot',
                                selected: 'tabItemSelected'
                            }}
                        />
                        <Tab
                            label="Notifications"
                            value='notifications'
                            classes={{
                                root: 'tabItemRoot',
                                selected: 'tabItemSelected'
                            }}
                        />
                        <Tab
                            label="Jobs I applied to"
                            value='jobs'
                            classes={{
                                root: 'tabItemRoot',
                                selected: 'tabItemSelected'
                            }}
                        />
                        <Tab
                            label="Following"
                            value='following'
                            classes={{
                                root: 'tabItemRoot',
                                selected: 'tabItemSelected'
                            }}
                        />

                    </Tabs>
                    {activeTab === 'settings' && <Settings {...props} />}
                    {activeTab === 'jobs' && <Jobs {...props} />}
                </Grid>
            </Grid>
        </div>
    )
};

export default UserSettings;