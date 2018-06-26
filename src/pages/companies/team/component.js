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
                    <Route exact path='/:lang(en|ro)/dashboard/company/team' component={Show} />
                    <Route exact path='/:lang(en|ro)/dashboard/company/team/feed' component={Feed} />
                </Switch>
            </React.Fragment>
        </div>
    );
}

export default Team;