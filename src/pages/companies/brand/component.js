import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

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

    const { id: userId } = currentUser || {};
    if (loading)
        return <Loader />

    const Show = () => {
        return (<CompanyShow {...props} />)
    };

    return (
        <div className='brandRoot'>
            {(company.owner.id === userId) &&
                <EditToggle />
            }
            <Header {...props} />
            <React.Fragment>
                <Switch>
                    <Route exact path='/:lang(en|ro)/company/:companyId' component={Show} />
                    <Route exact path='/:lang(en|ro)/company/:companyId/feed' component={CompanyFeed} />
                </Switch>
            </React.Fragment>
        </div>
    )
};

export default Brand;