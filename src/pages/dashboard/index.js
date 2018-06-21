import React, { Component } from 'react';
import Navigation from '../../components/navigation';
import { Switch, Route } from 'react-router-dom';
import UserProfile from '../users/userProfile';
import Brand from '../companies/brand';
import { compose, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { currentUserQuery } from '../../store/queries';

const News = () => <div>News</div>;
const People = () => <div>People</div>;
const Jobs = () => <div>Jobs</div>;

class Dashboard extends Component {
    render() {
        let { getCurrentUser } = this.props;
        if (getCurrentUser.loading)
            return <div>Loading</div>;
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
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}

const DashHOC = compose(
    graphql(currentUserQuery, {
        name: 'getCurrentUser',
        options: (props) => ({
            variables: { language: props.match.params.lang },
        }),
    }),
    pure
);

export default DashHOC(Dashboard);