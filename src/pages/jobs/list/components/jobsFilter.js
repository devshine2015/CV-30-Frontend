import React from 'react';
import { Grid, Button, TextField, Checkbox, InputAdornment } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import IndustryInput from '../../../../components/IndustryInput';
import SkillsInput from '../../../../components/SkillsInput';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export class JobsFilter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            companyName: '',
            skills: [],
            industryId: undefined
        };

        this.onFilterChanged = debounce(() => this.props.onFilterChange(this.state), 1000);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange = (event) => {
        console.log("----- handleFormChange -----")
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (!name) {
            throw Error('Field must have a name attribute!');
        }
        this.setState({ [name]: value });
        this.onFilterChanged();
    }

    render() {
        const { isPartTime, isFullTime, isProjectBased, isRemote, isStartup, isCorporation, isBoutique, isMultinational, handleSliderChange } = {};
        return (
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <FormattedMessage id="jobs.list.filterJobs" defaultMessage="Filter \njobs" description="Filter jobs">
                        {(text) => (
                            <h2 className="columnTitle">
                                {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                            </h2>
                        )}
                    </FormattedMessage>
                    
                    <div className='filters'>
                        <FormattedMessage id="jobs.list.searchCompany" defaultMessage="Company\nSearch for company..." description="Search for company">
                            {(text) => (
                                <TextField
                                    name='companyName'
                                    value={this.state.companyName || ''}
                                    onChange={this.handleFormChange}
                                    label={text.split("\n")[0]}
                                    placeholder={text.split("\n")[1]}
                                    type="search"
                                    className='textField'
                                />
                            )}
                        </FormattedMessage>
                        
                        <section className='jobType'>
                            <p className='sectionTitle'>Job type</p>
                            <label htmlFor="isPartTime">
                                <Checkbox
                                    id='isPartTime'
                                    name='isPartTime'
                                    checked={isPartTime}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="jobs.partTime" defaultMessage="Part time" description="Part time">
                                    {(text) => (
                                        <Button component='span' className={isPartTime ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isFullTime">
                                <Checkbox
                                    id='isFullTime'
                                    name='isFullTime'
                                    checked={isFullTime}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="jobs.fullTime" defaultMessage="Full time" description="Full time">
                                    {(text) => (
                                        <Button component='span' className={isFullTime ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isProjectBased">
                                <Checkbox
                                    id='isProjectBased'
                                    name='isProjectBased'
                                    checked={isProjectBased}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="jobs.projectBased" defaultMessage="Project based" description="Project based">
                                    {(text) => (
                                        <Button component='span' className={isProjectBased ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isRemote">
                                <Checkbox
                                    id='isRemote'
                                    name='isRemote'
                                    checked={isRemote}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="jobs.remote" defaultMessage="Remote" description="Remote">
                                    {(text) => (
                                        <Button component='span' className={isRemote ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                        </section>
                        <section className='compensation'>
                            <FormattedMessage id="jobs.list.compensation" defaultMessage="Compensation" description="Compensation">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
                            <Range min={0} max={3000} defaultValue={[0, 1000]} tipFormatter={value => `${value}E`} step={10} onChange={handleSliderChange} />
                        </section>
                        <section className='matching'>
                            <FormattedMessage id="jobs.list.match" defaultMessage="Match" description="Match">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
                            <Range min={0} max={100} defaultValue={[25, 75]} tipFormatter={value => `${value}%`} step={1} onChange={handleSliderChange} />
                        </section>
                        <section className='advanced'>
                            <FormattedMessage id="jobs.list.advancedSearch" defaultMessage="Advanced search" description="Advanced search">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.searchSkills" defaultMessage="Skills\nSearch skill..." description="Search skill">
                                {(text) => (
                                    <SkillsInput
                                        className='textField'
                                        value={this.state.skills}
                                        onChange={val => this.handleFormChange({ target: { name: 'skills', value: val }})}
                                    />
                                    // <TextField
                                    //     name='skills'
                                    //     label={text.split("\n")[0]}
                                    //     placeholder={text.split("\n")[1]}
                                    //     type="search"
                                    //     className='textField'
                                    // />
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.searchBenefits" defaultMessage="Benefits\nSearch benefits..." description="">
                                {(text) => (
                                    <TextField
                                        name='benefits'
                                        label={text.split("\n")[0]}
                                        placeholder={text.split("\n")[1]}
                                        type="search"
                                        className='textField'
                                    />
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.searchTeam" defaultMessage="Team\nSearch teams..." description="Search teams">
                                {(text) => (
                                    <TextField
                                        name='team'
                                        label={text.split("\n")[0]}
                                        placeholder={text.split("\n")[1]}
                                        type="search"
                                        className='textField'
                                    />
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.searchIndustry" defaultMessage="Industry\nSearch industries..." description="Search industries">
                                {(text) => (
                                    <IndustryInput
                                        i18nid='jobs.searchIndustry'
                                        className='textField'
                                        updateFormState={val => this.handleFormChange({ target: { name: val[0].field, value: val[0].value }})}
                                        value={this.state.industryId}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><i className='fas fa-industry-alt' /></InputAdornment>,
                                        }}
                                    />
                                    // <TextField
                                    //     name='industry'
                                    //     label={text.split("\n")[0]}
                                    //     placeholder={text.split("\n")[1]}
                                    //     type="search"
                                    //     className='textField'
                                    // />
                                )}
                            </FormattedMessage>
                            
                        </section>
                        <section className='companyType'>
                            <FormattedMessage id="jobs.companyType" defaultMessage="Company type" description="Company type">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
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