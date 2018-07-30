import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import { Switch, Route } from 'react-router-dom';

import UserProfileShow from './components/show';
import UserProfileFeed from './components/feed';
import Header from './components/header';
import Loader from '../../../components/Loader';
import EditToggle from '../../../components/EditToggle';

const UserProfile = props => {
    const {
        currentProfile: { loading, profile },
        currentUser: { auth: { currentUser } }
    } = props;

    const { id: userId } = currentUser || {};

    const Show = () => <UserProfileShow {...props} />

    if (loading)
        return <Loader />

    return (<div className='userProfileRoot'>
        {(profile.id === userId) &&
            <EditToggle />
        }
        <Header {...props} />
        <React.Fragment>
            <Switch>
                <Route exact path='/:lang(en|ro)/myProfile/feed' component={UserProfileFeed} />
                <Route path='/:lang(en|ro)/profile/:profileId/feed' component={UserProfileFeed} />
                <Route path='/:lang(en|ro)/(profile|myProfile)/:profileId?' component={Show} />
            </Switch>
        </React.Fragment>
    </div>
    );
}

export default UserProfile;