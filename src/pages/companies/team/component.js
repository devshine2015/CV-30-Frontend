import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import Header from './components/header';
import Show from './components/show';
import Feed from './components/feed';
import EditToggle from '../../../components/EditToggle';
import Loader from '../../../components/Loader';

const Team = props => {
    const {
        queryTeam: { loading, team },
        currentUser: { auth: { currentUser } }
    } = props;

    if (loading)
        return <Loader />

    const { id: userId } = currentUser || {};

    return (
        <div className='teamRoot'>
            {(team.company.owner.id === userId) &&
                <EditToggle />
            }
            <Header {...props} />
            <React.Fragment>
                <Switch>
                    <Route exact path='/:lang(en|ro)/team/:teamId' render={() => <Show {...props} />} />
                    <Route exact path='/:lang(en|ro)/team/:teamId/feed' component={Feed} />
                </Switch>
            </React.Fragment>
        </div>
    );
}

export default Team;