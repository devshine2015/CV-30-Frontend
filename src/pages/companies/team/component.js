import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import Header from './components/header';
import Show from './components/show';
import Feed from './components/feed';

const Team = props => {
    const { editMode, switchEditMode, queryTeam: { loading } } = props;
    
    const ShowWithProps = () => {
        return (<Show {...props} />)
    };
    
    return (
        <div className='teamRoot'>
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
                    <Route exact path='/:lang(en|ro)/dashboard/team/:teamId' component={ShowWithProps} />
                    <Route exact path='/:lang(en|ro)/dashboard/team/:teamId/feed' component={Feed} />
                </Switch>
            </React.Fragment>
        </div>
    );
}

export default Team;