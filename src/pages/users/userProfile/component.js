import React from 'react';

import { Switch, Route } from 'react-router-dom';

import UserProfileShow from './components/show';
import UserProfileFeed from './components/feed';
import Header from './components/header';
import Loader from '../../../components/Loader';
import EditToggle from '../../../components/EditToggle';

const UserProfile = props => {
    const {
        profileQuery: { profile },
        currentUser: { auth: { currentUser } }
    } = props;

    if (!profile)
        return <Loader />;

    const { id: userId } = currentUser || {};
    const isEditAllowed = profile.id === userId;

    return (<div className='userProfileRoot'>
        {(isEditAllowed) &&
            <EditToggle />
        }
        <Header {...props} isEditAllowed={isEditAllowed} />
        <React.Fragment>
            <Switch>
                <Route exact path='/:lang(en|ro)/myProfile/feed' component={UserProfileFeed} />
                <Route path='/:lang(en|ro)/profile/:profileId/feed' component={UserProfileFeed} />
                <Route path='/:lang(en|ro)/(profile|myProfile)/:profileId?' render={() => <UserProfileShow {...props} isEditAllowed={isEditAllowed} />} />
            </Switch>
        </React.Fragment>
    </div>
    );
}

export default UserProfile;