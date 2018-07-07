import React from 'react';
import { Grid, Tabs, Tab } from '@material-ui/core';
import Settings from './components/settings';
import Jobs from './components/jobs';

// import Notifications from './components/notifications';
// import Following from './components/following';

const CompanySettings = props => {
    const { handleTabChange, activeTab } = props;
    return (
        <div className='companySettingsRoot'>
            <Grid container className='header'>
                <Grid item sm={11} lg={8} className='settingsColumn'>
                    <h1 className='settingsTitle'>My <b>company</b></h1>
                    <p className='settingsMessage'>Ut odio stet vis. Et nec perfecto delicata. Hendrerit disputando et usu. Vel no facilis sadipscing, omnis fierent ullamcorper eu est.</p>
                </Grid>
            </Grid>
            <Grid container className='mainBody companySettings'>
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
                            label="Company jobs"
                            value='jobs'
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

export default CompanySettings;