import React from 'react';
import { Grid, Button, TextField, Checkbox, InputAdornment } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';

import LocationInput from '../../../../components/LocationInput';
import IndustryInput from '../../../../components/IndustryInput';

export class CompaniesFilter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            location: '',
            industryId: undefined,
            teamdId: undefined
        };

        this.onFilterChange = debounce(() => this.props.onFilterChange(this.state), 1000);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange = (event) => {
        console.log("------handleFormChange-------");
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (!name) {
            throw Error('Field must have a name attribute!');
        }
        this.setState({ [name]: value });
        this.onFilterChange();
    }

    render() {
        const { isStartup, isCorporation, isBoutique, isMultinational } = {};
        return (
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>       
                <div className='columnRightContent'>
                    <FormattedMessage id="company.list.findCompany" defaultMessage="Find \ncompany" description="Find company">
                        {(text) => (
                                <h2 className="columnTitle">
                                {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                            </h2>
                        )}
                    </FormattedMessage>
                    
                    <div className='filters'>
                        
                        <FormattedMessage id="company.list.searchFilters" defaultMessage="Company\nSearch company...\nLocation\nFind city...\nIndustry\nFind industry...\nTeam\nFind team..." description="Search Filters">
                            {(text) => (
                                <section className='advanced'>
                                    <TextField
                                        name='name'
                                        label={text.split("\n")[0]}
                                        placeholder={text.split("\n")[1]}
                                        type="search"
                                        className='textField'
                                        onChange={this.handleFormChange}
                                    />
                                    <LocationInput
                                        className='textField'
                                        label={text.split("\n")[2]}
                                        placeholder={text.split("\n")[3]}
                                        updateFormState={val => this.handleFormChange({ target: { name: val[0].field, value: val[0].value }})}
                                        value={this.state.location}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><i className='fas fa-map-marker-alt' /></InputAdornment>,
                                        }}
                                    />
                                    {/* <TextField
                                        name='city'
                                        label={text.split("\n")[2]}
                                        placeholder={text.split("\n")[3]}
                                        type="search"
                                        className='textField'
                                    /> */}
                                    <IndustryInput
                                        className='textField'
                                        label={text.split("\n")[4]}
                                        placeholder={text.split("\n")[5]}
                                        updateFormState={val => this.handleFormChange({ target: { name: val[0].field, value: val[0].value }})}
                                        value={this.state.industryId}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><i className='fas fa-industry-alt' /></InputAdornment>,
                                        }}
                                    />
                                    {/* <TextField
                                        name='industry'
                                        label={text.split("\n")[4]}
                                        placeholder={text.split("\n")[5]}
                                        type="search"
                                        className='textField'
                                    /> */}
                                    <TextField
                                        name='team'
                                        label={text.split("\n")[6]}
                                        placeholder={text.split("\n")[7]}
                                        type="search"
                                        className='textField'
                                    />
                                </section>
                            )}
                        </FormattedMessage>
                            
                        
                        <section className='companyType'>
                            <p className='sectionTitle'>Company type</p>
                            <label htmlFor="isStartup">
                                <Checkbox
                                    id='isStartup'
                                    name='isStartup'
                                    checked={isStartup}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="company.list.startUp" defaultMessage="Startup" description="Startup">
                                    {(text) => (
                                        <Button component='span' className={isStartup ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isCorporation">
                                <Checkbox
                                    id='isCorporation'
                                    name='isCorporation'
                                    checked={isCorporation}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="company.list.corporation" defaultMessage="Corporation" description="Corporation">
                                    {(text) => (
                                        <Button component='span' className={isCorporation ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isBoutique">
                                <Checkbox
                                    id='isBoutique'
                                    name='isBoutique'
                                    checked={isBoutique}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="company.list.boutique" defaultMessage="Boutique" description="Boutique">
                                    {(text) => (
                                        <Button component='span' className={isBoutique ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isMultinational">
                                <Checkbox
                                    id='isMultinational'
                                    name='isMultinational'
                                    checked={isMultinational}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="company.list.multinational" defaultMessage="Multinational" description="Multinational">
                                    {(text) => (
                                        <Button component='span' className={isMultinational ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                        </section>
                    </div>
                </div>
            </Grid>
        )
    };
}