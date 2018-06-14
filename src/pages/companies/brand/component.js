import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import Header from './components/header';

import CompanyShow from './components/show';
import CompanyFeed from './components/feed';

const Brand = (props) => {
    const Show = (props) => {
        return (<CompanyShow {...props} />)
    }
    const { editMode, switchEditMode } = props;
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
                    <Route exact path='/:lang(en|ro)/dashboard/companies' component={Show} />
                    <Route exact path='/:lang(en|ro)/dashboard/companies/feed' component={CompanyFeed} />
                </Switch>
            </React.Fragment>
        </div>
    )
};

export default Brand;