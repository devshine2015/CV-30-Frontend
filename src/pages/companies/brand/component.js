import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';

import Header from './components/header';
import CompanyShow from './components/show';
import CompanyFeed from './components/feed';
import Loader from '../../../components/Loader';

const Brand = (props) => {
    const { editMode, switchEditMode, companyQuery: { loading } } = props;
    if (loading)
        return <Loader />

    const Show = () => {
        return (<CompanyShow {...props} />)
    };

    return (
        <div className='brandRoot'>
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
                    <Route exact path='/:lang(en|ro)/dashboard/company/:companyId' component={Show} />
                    <Route exact path='/:lang(en|ro)/dashboard/company/:companyId/feed' component={CompanyFeed} />
                </Switch>
            </React.Fragment>
        </div>
    )
};

export default Brand;