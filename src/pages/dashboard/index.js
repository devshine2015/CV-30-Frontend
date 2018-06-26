import React, { Component } from 'react';
import Navigation from '../../components/navigation';
import { Switch, Route } from 'react-router-dom';

import UserProfile from '../users/userProfile';
import Brand from '../companies/brand';
import Team from '../companies/team';
import Jobs from '../job';


const News = () => <div>News</div>;
const People = () => <div>People</div>;


class Dashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <Navigation {...this.props} />
                <div className='dashboardRoot'>
                    <Switch>
                        <Route path='/:lang(en|ro)/dashboard/news' exact component={News} />
                        <Route path='/:lang(en|ro)/dashboard/companies' component={Brand} />
                        <Route path='/:lang(en|ro)/dashboard/people' exact component={People} />
                        <Route path='/:lang(en|ro)/dashboard/jobs' exact component={Jobs} />
                        <Route path='/:lang(en|ro)/dashboard/profile' component={UserProfile} />
                        <Route path='/:lang(en|ro)/dashboard/company/team' component={Team} />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}

export default Dashboard;