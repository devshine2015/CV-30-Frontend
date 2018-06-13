import React from 'react';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import { Switch, Route } from 'react-router-dom';

import UserProfileShow from './components/show';
import UserProfileFeed from './components/feed';
import Header from './components/header';

const UserProfile = (props) => {
    const { editMode, switchEditMode } = props;

    const Show = () => <UserProfileShow {...props} />

    return (<div className='userProfileRoot'>
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

        <Header {...props} />

        <React.Fragment>
            <Switch>
                <Route exact path='/:lang(en|ro)/dashboard/profile' component={Show} />
                <Route exact path='/:lang(en|ro)/dashboard/profile/feed' component={UserProfileFeed} />
            </Switch>
        </React.Fragment>
    </div>
    );
}

export default UserProfile;