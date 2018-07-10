import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './components/header';
import Show from './components/show';
import Feed from './components/feed';

const Team = props => {
    return (
        <div className='teamRoot'>
            <Header {...props} />
            <React.Fragment>
                <Switch>
                    <Route exact path='/:lang(en|ro)/dashboard/company/:companyId/team/:teamId' component={Show} />
                    <Route exact path='/:lang(en|ro)/dashboard/company/:companyId/team/:teamId/feed' component={Feed} />
                </Switch>
            </React.Fragment>
        </div>
    );
}

export default Team;