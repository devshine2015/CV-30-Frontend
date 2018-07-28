import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import { Switch, Route } from 'react-router-dom';

import UserProfileShow from './components/show';
import UserProfileFeed from './components/feed';
import Header from './components/header';
import Loader from '../../../components/Loader';

const UserProfile = (props) => {
    const {
        editMode, switchEditMode,
        currentProfile: { loading, profile },
        currentUser: { auth: { currentUser: { id: userId } } }
    } = props;

    const Show = () => <UserProfileShow editMode={editMode} profile={profile} />

    if (loading)
        return <Loader />

    return (<div className='userProfileRoot'>
        {(profile.id === userId) &&
            <FormGroup row className='editToggle'>
                <FormLabel className={!editMode ? 'active' : ''}>View</FormLabel>
                <ToggleSwitch checked={editMode} onChange={switchEditMode}
                    classes={{
                        switchBase: 'colorSwitchBase',
                        checked: 'colorChecked',
                        bar: 'colorBar',
                    }}
                    color="primary" />
                <FormLabel className={editMode ? 'active' : ''}>Edit</FormLabel>
            </FormGroup>
        }
        <Header profile={profile} editMode={editMode} />
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