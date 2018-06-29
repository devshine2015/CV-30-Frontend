import React from 'react';
import { Grid } from '@material-ui/core';
import Profile from './components/profile';

const UsersList = props => {
    const { data } = props;
    return (
        <Grid container className='mainBody userListRoot'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                {data.map((user, index) => (<Profile {...user} key={`userProfile-${index}`} />))}
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                </div>
            </Grid>
        </Grid>
    )
}

export default UsersList;