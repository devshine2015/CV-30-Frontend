import React from 'react';
import { Grid, Button, TextField, Hidden, InputAdornment, Checkbox } from '@material-ui/core';
import JobItem from './components/jobItem';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import uuid from 'uuid/v4';


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const JobsList = props => {
    const { data, formData, handleFormChange } = props;
    const { jobName, isPartTime, isFullTime, isProjectBased, isRemote, isStartup, isCorporation, isBoutique, isMultinational, handleSliderChange } = formData;
    return (
        <div className='jobsListRoot'>
            <Grid container className='header'>
                <Grid item lg={6} md={6} sm={12} xs={12} className='centralColumn'>
                    <h1 className='searchTitle'>Search <b>jobs</b></h1>
                    <div className='searchFields'>
                        <TextField
                            name='jobName'
                            value={jobName || ''}
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
                        <TextField
                            name='company'
                            label='Company'
                            placeholder='Search for company...'
                            type="search"
                            className='textField'
                        />
                        <section className='jobType'>
                            <p className='sectionTitle'>Job type</p>
                            <label htmlFor="isPartTime">
                                <Checkbox
                                    id='isPartTime'
                                    name='isPartTime'
                                    checked={isPartTime}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isPartTime ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    Part time
                                </Button>
                            </label>
                            <label htmlFor="isFullTime">
                                <Checkbox
                                    id='isFullTime'
                                    name='isFullTime'
                                    checked={isFullTime}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isFullTime ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    Full time
                                </Button>
                            </label>
                            <label htmlFor="isProjectBased">
                                <Checkbox
                                    id='isProjectBased'
                                    name='isProjectBased'
                                    checked={isProjectBased}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isProjectBased ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    Project based
                                </Button>
                            </label>
                            <label htmlFor="isRemote">
                                <Checkbox
                                    id='isRemote'
                                    name='isRemote'
                                    checked={isRemote}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isRemote ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    isRemote
                                </Button>
                            </label>
                        </section>
                        <section className='compensation'>
                            <p className='sectionTitle'>Compensation</p>
                            <Range min={0} max={3000} defaultValue={[0, 1000]} tipFormatter={value => `${value}E`} step={10} onChange={handleSliderChange} />
                        </section>
                        <section className='matching'>
                            <p className='sectionTitle'>Match</p>
                            <Range min={0} max={100} defaultValue={[25, 75]} tipFormatter={value => `${value}%`} step={1} onChange={handleSliderChange} />
                        </section>
                        <section className='advanced'>
                            <p className='sectionTitle'>Advanced search</p>
                            <TextField
                                name='skills'
                                label='Skills'
                                placeholder='Search skill...'
                                type="search"
                                className='textField'
                            />
                            <TextField
                                name='benefits'
                                label='Benefits'
                                placeholder='Search benefits...'
                                type="search"
                                className='textField'
                            />
                            <TextField
                                name='team'
                                label='Team'
                                placeholder='Search teams...'
                                type="search"
                                className='textField'
                            />
                            <TextField
                                name='industry'
                                label='Industry'
                                placeholder='Search industries...'
                                type="search"
                                className='textField'
                            />
                        </section>
                        <section className='jobType'>
                            <p className='sectionTitle'>Company type</p>
                            <label htmlFor="isStartup">
                                <Checkbox
                                    id='isStartup'
                                    name='isStartup'
                                    checked={isStartup}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isStartup ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    isStartup
                                </Button>
                            </label>
                            <label htmlFor="isCorporation">
                                <Checkbox
                                    id='isCorporation'
                                    name='isCorporation'
                                    checked={isCorporation}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isCorporation ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    isCorporation
                                </Button>
                            </label>
                            <label htmlFor="isBoutique">
                                <Checkbox
                                    id='isBoutique'
                                    name='isBoutique'
                                    checked={isBoutique}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isBoutique ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    isBoutique
                                </Button>
                            </label>
                            <label htmlFor="isMultinational">
                                <Checkbox
                                    id='isMultinational'
                                    name='isMultinational'
                                    checked={isMultinational}
                                    onChange={handleFormChange}
                                    className='hiddenInput'
                                />
                                <Button component='span' className={isMultinational ? 'checkboxBtn active' : 'checkboxBtn'}>
                                    isMultinational
                                </Button>
                            </label>
                        </section>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default JobsList;