import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import Header from './components/header';
import CompanyShow from './components/show';
import CompanyFeed from './components/feed';
import Loader from '../../../components/Loader';
import EditToggle from '../../../components/EditToggle';

const Brand = props => {
    
    const {
        companyQuery: { loading, company },
        currentUser: { auth: { currentUser } }
    } = props;

    if (loading)
        return <Loader />

    const { id: userId } = currentUser || {};
    const isEditAllowed = company.owner.id === userId;

    return (
        <div className='brandRoot'>
            {isEditAllowed &&
                <EditToggle />
            }
            {console.log('============= props =============', props)}
            <Header {...props} isEditAllowed={isEditAllowed} />
            <React.Fragment>
                <Switch>
                    <Route exact path='/:lang(en|ro)/company/:companyId' render={() => <CompanyShow {...props} isEditAllowed={isEditAllowed} />} />
                    <Route exact path='/:lang(en|ro)/company/:companyId/feed' component={CompanyFeed} />
                </Switch>
            </React.Fragment>
        </div>
    )
};

export default Brand;