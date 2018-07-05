import React, { Component } from 'react';
import Navigation from '../../components/navigation';
import { Switch, Route } from 'react-router-dom';

import UserProfile from '../users/userProfile';
import UserProfileSettings from '../users/settings';
import Brand from '../companies/brand';
import Team from '../companies/team';
import Jobs from '../jobs/list';
import Job from '../jobs/view';
import UsersList from '../users/list';
import CompaniesList from '../companies/list';

const News = () => <div>News</div>;


class Dashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <Navigation {...this.props} />
                <div className='dashboardRoot'>
                    <Switch>
                        <Route path='/:lang(en|ro)/dashboard/news' exact component={News} />

                        <Route path='/:lang(en|ro)/dashboard/companies' component={CompaniesList} />
                        <Route path='/:lang(en|ro)/dashboard/company/team' component={Team} />
                        <Route path='/:lang(en|ro)/dashboard/company/:companyId' component={Brand} />

                        <Route path='/:lang(en|ro)/dashboard/jobs' exact component={Jobs} />
                        <Route path='/:lang(en|ro)/dashboard/job/:jobId' exact component={Job} />

                        <Route path='/:lang(en|ro)/dashboard/people' exact component={UsersList} />
                        <Route path='/:lang(en|ro)/dashboard/profile/:profileId?/settings' component={UserProfileSettings} />
                        <Route path='/:lang(en|ro)/dashboard/profile/:profileId?' component={UserProfile} />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}

export default Dashboard;