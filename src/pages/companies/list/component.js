import React from 'react';
import { Grid } from '@material-ui/core';
import Company from './components/company';

const CompaniesList = props => {
    const { loading, companies } = props.companiesQuery;
    if (loading) {
        return <div>Loading...</div>
    } else {
        return (
            <Grid container className='mainBody companiesListRoot'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    {companies.map(company => (<Company company={company} key={company.id} />))}
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default CompaniesList;