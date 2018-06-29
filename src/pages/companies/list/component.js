import React from 'react';
import { Grid } from '@material-ui/core';
import Company from './components/company';

const CompaniesList = props => {
    const { data } = props;
    return (
        <Grid container className='mainBody companiesListRoot'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                {data.map((company, index) => (<Company {...company} key={`company-${index}`} />))}
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                </div>
            </Grid>
        </Grid>
    )
}

export default CompaniesList;