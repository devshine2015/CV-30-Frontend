import React, { Component } from 'react';
import Navigation from '../../components/navigation';
import { Switch, Route, Redirect } from 'react-router-dom';

import NewsFeed from '../feed/';
import UserProfile from '../users/userProfile';
import UserProfileSettings from '../users/settings';
import Brand from '../companies/brand';
import Team from '../companies/team';
import Jobs from '../jobs/list';
import Job from '../jobs/view';
import NewJob from '../jobs/new';
import UsersList from '../users/list';
import CompaniesList from '../companies/list';
import NewCompany from '../companies/new';
import CompanySettings from '../companies/settings';

class Dashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <Navigation {...this.props} />
                <div className='dashboardRoot'>
                    <Switch>
                        <Route path='/:lang(en|ro)/dashboard/news' exact component={NewsFeed} />

                        <Route exact path='/:lang(en|ro)/dashboard/companies' component={CompaniesList} />
                        <Route exact path='/:lang(en|ro)/dashboard/companies/new' component={NewCompany} />
                        <Route exact path='/:lang(en|ro)/dashboard/company/:companyId/settings' component={CompanySettings} />
                        <Route path='/:lang(en|ro)/dashboard/company/:companyId' component={Brand} />

                        <Route path='/:lang(en|ro)/dashboard/team/:teamId' component={Team} />

                        <Route path='/:lang(en|ro)/dashboard/jobs' exact component={Jobs} />
                        <Route path='/:lang(en|ro)/dashboard/jobs/new' exact component={NewJob} />
                        <Route path='/:lang(en|ro)/dashboard/job/:jobId' exact component={Job} />

                        <Route path='/:lang(en|ro)/dashboard/people' exact component={UsersList} />
                        <Route path='/:lang(en|ro)/dashboard/profile/:profileId?/settings' component={UserProfileSettings} />
                        <Route path='/:lang(en|ro)/dashboard/profile/:profileId?' component={UserProfile} />

                        <Redirect from={'*'} to='/dashboard/news' />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}

export default Dashboard;