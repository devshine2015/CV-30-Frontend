import React from 'react';
import { Grid, Button, TextField, Hidden, InputAdornment } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import LocationInput from '../../../../components/LocationInput';

export class JobsSearch extends React.PureComponent {
    state = {
        title: '',
        location: ''
    };

    handleSearchFormChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (!name) {
            throw Error('Field must have a name attribute!');
        }
        this.setState({ [name]: value });
    }

    render() {
        return (
            <Grid container className='header'>
                <Grid item lg={6} md={12} sm={12} xs={12} className='centralColumn'>
                    <FormattedMessage id="jobs.list.searchJobs" defaultMessage="Search \njobs" description="Search jobs">
                        {(text) => (
                            <h1 className='searchTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h1>
                        )}
                    </FormattedMessage>
                    
                    <div className='searchFields'>
                        <FormattedMessage id="jobs.list.title" defaultMessage="Job title..." description="Job title">
                            {(text) => (
                                <TextField
                                    name="title"
                                    value={this.state.title}
                                    onChange={this.handleSearchFormChange}
                                    label={text}
                                    type="search"
                                    className='textField'
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><i className='fas fa-briefcase' /></InputAdornment>,
                                    }}
                                />
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="jobs.list.location" defaultMessage="Location..." description="Location">
                            {(text) => (
                                <LocationInput
                                    i18nid='jobs.list.location'
                                    className='textField'
                                    updateFormState={val => this.handleSearchFormChange({ target: { name: val[0].field, value: val[0].value }})}
                                    value={this.state.location}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><i className='fas fa-map-marker-alt' /></InputAdornment>,
                                    }}
                                />
                                // <TextField
                                //     name="location"
                                //     value={this.state.location || ''}
                                //     onChange={this.handleSearchFormChange}
                                //     label={text}
                                //     type="search"
                                //     className='textField'
                                //     InputProps={{
                                //         startAdornment: <InputAdornment position="start"><i className='fas fa-map-marker-alt' /></InputAdornment>,
                                //     }}
                                // />
                            )}
                        </FormattedMessage>
                        <FormattedMessage id="jobs.list.searchBtn" defaultMessage="Search" description="Search">
                            {(text) => (
                                <Button className='searchBtn' onClick={() => this.props.onSearch(this.state)}>
                                    {text}
                                </Button>
                            )}
                        </FormattedMessage>
                        
                    </div>
                </Grid>
                <Hidden mdDown>
                    <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
                </Hidden>
            </Grid>
        )
    };
}