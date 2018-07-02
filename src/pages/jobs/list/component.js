import React from 'react';
import { Grid, Button, TextField, Hidden, InputAdornment } from '@material-ui/core';
import JobItem from './components/jobItem';

const JobsList = props => {
    const { data } = props;
    return (
        <div className='jobsListRoot'>
            <Grid container className='header'>
                <Grid item lg={6} md={6} sm={12} xs={12} className='centralColumn'>
                    <h1 className='searchTitle'>Search <b>jobs</b></h1>
                    <div className='searchFields'>
                        <TextField
                            name='jobName'
                            label="Job title..."
                            type="search"
                            className='textField'
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><i className='fas fa-briefcase' /></InputAdornment>,
                            }}
                        />
                        <TextField
                            name='location'
                            label="Location..."
                            type="search"
                            className='textField'
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><i className='fas fa-map-marker-alt' /></InputAdornment>,
                            }}
                        />
                        <Button className='searchBtn'>
                            Search
                    </Button>
                    </div>
                </Grid>
                <Hidden mdDown>
                    <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
                </Hidden>
            </Grid>
            <Grid container className='mainBody jobsList'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    {data.map((job, index) => (<JobItem {...job} key={`job-${index}`} />))}
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <h2 className="columnTitle">
                            Filter <b>jobs</b>
                        </h2>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default JobsList;