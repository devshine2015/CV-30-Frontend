import React from 'react';
import { Grid, TextField, Checkbox, Button } from '@material-ui/core';
import Company from './components/company';
import Loader from '../../../components/Loader';

const CompaniesList = props => {
    const { handleFormChange, formData, companiesQuery } = props;
    const { loading, companies } = companiesQuery;
    const { isStartup, isCorporation, isBoutique, isMultinational } = formData;

    if (loading) {
        return <Loader />
    } else {
        return (
            <Grid container className='mainBody companiesListRoot'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    {companies && companies.map(company => (<Company company={company} key={company.id} />))}
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <h2 className="columnTitle">
                            Find <b>company</b>
                        </h2>
                        <div className='filters'>
                            <section className='advanced'>
                                <TextField
                                    name='company'
                                    label='Company'
                                    placeholder='Search company...'
                                    type="search"
                                    className='textField'
                                />
                                <TextField
                                    name='city'
                                    label='City'
                                    placeholder='Find city...'
                                    type="search"
                                    className='textField'
                                />
                                <TextField
                                    name='industry'
                                    label='Industry'
                                    placeholder='Find industry...'
                                    type="search"
                                    className='textField'
                                />
                                <TextField
                                    name='team'
                                    label='Team'
                                    placeholder='Find team...'
                                    type="search"
                                    className='textField'
                                />
                            </section>
                            <section className='companyType'>
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
                                        Startup
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
                                        Corporation
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
                                        Boutique
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
                                        Multinational
                                </Button>
                                </label>
                            </section>
                        </div>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default CompaniesList;