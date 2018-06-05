import React, { Component } from 'react';
import Navigation from '../../components/navigation';
import { Switch, Route } from 'react-router-dom';
import UserProfile from '../users/userProfile';
import Brand from '../companies/brand';
const News = () => <div>News</div>;

const People = () => <div>People</div>;
const Jobs = () => <div>Jobs</div>;

class Dashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <Navigation {...this.props} />
                <div className='dashboardRoot'>
                    <Switch>
                        <Route path='/:lang(en|ro)/dashboard/news' exact component={News} />
                        <Route path='/:lang(en|ro)/dashboard/companies' exact component={Brand} />
                        <Route path='/:lang(en|ro)/dashboard/people' exact component={People} />
                        <Route path='/:lang(en|ro)/dashboard/jobs' exact component={Jobs} />
                        <Route path='/:lang(en|ro)/dashboard/profile' component={UserProfile} />
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}

export default Dashboard;