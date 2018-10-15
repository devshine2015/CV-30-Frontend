import React from 'react';
import { Grid, TextField, Button, Checkbox, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import SkillsInput from '../../../../components/SkillsInput';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

export class ProfilesFilter extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            location: '',
            skills: [],
            values: [],
            companyName: '',
            jobTypes: [],
            // education
            isProfileVerified: false
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

    toggleIsProfileVerified = () => {
        this.setState({ isProfileVerified: !this.state.isProfileVerified });
        this.onFilterChanged();
    }

    render() {
        const { isHighSchool, isUniversity, isMasters, isDoctorate, handleSliderChange } = {};
        return (
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <FormattedMessage id="users.findPeople" defaultMessage="Find \npeople" description="Find people">
                        {(text) => (
                            <h2 className="columnTitle">
                                {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                            </h2>
                        )}
                    </FormattedMessage>
                    
                    <div className='filters'>
                        <FormattedMessage id="users.searchFitlers" defaultMessage="Name\nSearch by name...\nCity\nSearch by city...\nHard skills\nSearch by hard skills...\nSoft skills\nSearch by soft skills...\nCompany\nSearch by company..." description="User Search Filters">
                            {(text) => (
                                <section className='advanced'>
                                    <TextField
                                        name='name'
                                        label={text.split("\n")[0]}
                                        placeholder={text.split("\n")[1]}
                                        type="search"
                                        className='textField'
                                        value={this.state.name}
                                        onChange={this.handleFormChange}
                                    />
                                    <TextField
                                        name='location'
                                        label={text.split("\n")[2]}
                                        placeholder={text.split("\n")[3]}
                                        type="search"
                                        className='textField'
                                        value={this.state.location}
                                        onChange={this.handleFormChange}
                                    />
                                    {/* <TextField
                                        name='hSkill'
                                        label={text.split("\n")[4]}
                                        placeholder={text.split("\n")[5]}
                                        type="search"
                                        className='textField'
                                    /> */}
                                    <SkillsInput
                                        className='textField'
                                        label={text.split("\n")[4]}
                                        placeholder={text.split("\n")[5]}
                                        value={this.state.skills}
                                        onChange={val => this.handleFormChange({ target: { name: 'skills', value: val }})}
                                    />
                                    <TextField
                                        name='sSkill'
                                        label={text.split("\n")[6]}
                                        placeholder={text.split("\n")[7]}
                                        type="search"
                                        className='textField'
                                    />
                                    <TextField
                                        name='companyName'
                                        label={text.split("\n")[8]}
                                        placeholder={text.split("\n")[9]}
                                        type="search"
                                        className='textField'
                                        value={this.state.companyName}
                                        onChange={this.handleFormChange}
                                    />
                                </section>
                            )}
                        </FormattedMessage>
                        

                        <section className='educationType'>
                            <p className='sectionTitle'>Education</p>
                            <label htmlFor="isHighSchool">
                                <Checkbox
                                    id='isHighSchool'
                                    name='isHighSchool'
                                    checked={isHighSchool}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.highschool" defaultMessage="HighSchool" description="HighSchool">
                                    {(text) => (
                                        <Button component='span' className={isHighSchool ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isUniversity">
                                <Checkbox
                                    id='isUniversity'
                                    name='isUniversity'
                                    checked={isUniversity}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.university" defaultMessage="University" description="University">
                                    {(text) => (
                                        <Button component='span' className={isUniversity ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isMasters">
                                <Checkbox
                                    id='isMasters'
                                    name='isMasters'
                                    checked={isMasters}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.master" defaultMessage="Master's Degree" description="Master's Degree">
                                    {(text) => (
                                        <Button component='span' className={isMasters ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                            <label htmlFor="isDoctorate">
                                <Checkbox
                                    id='isDoctorate'
                                    name='isDoctorate'
                                    checked={isDoctorate}
                                    onChange={this.handleFormChange}
                                    className='hiddenInput'
                                />
                                <FormattedMessage id="users.doctor" defaultMessage="Doctorate Degree" description="Doctorate Degree">
                                    {(text) => (
                                        <Button component='span' className={isDoctorate ? 'checkboxBtn active' : 'checkboxBtn'}>
                                            {text}
                                        </Button>
                                    )}
                                </FormattedMessage>
                                
                            </label>
                        </section>
                        <section className='endorsment'>
                            <FormattedMessage id="users.endorsmentLevel" defaultMessage="Endorsment level" description="Endorsment level">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
                            <Range min={100} max={300} defaultValue={[100, 300]} step={10} onChange={handleSliderChange} />
                        </section>
                        <section className='verifiedProfile'>
                            <FormattedMessage id="nav.profile" defaultMessage="Profile" description="Profile">
                                {(text) => (
                                    <p className='sectionTitle'>{text}</p>
                                )}
                            </FormattedMessage>
                            
                            <FormGroup row className='profileToggle'>
                                <FormattedMessage id="users.verified" defaultMessage="Verified" description="Verified">
                                    {(text) => (
                                        <FormLabel className={this.state.isProfileVerified ? 'active' : ''}>{text}</FormLabel>
                                    )}
                                </FormattedMessage>
                            
                                <ToggleSwitch checked={this.state.isProfileVerified} onChange={this.toggleIsProfileVerified}
                                    classes={{
                                        switchBase: 'colorSwitchBase',
                                        checked: 'colorChecked',
                                        bar: 'colorBar',
                                    }}
                                    color="primary" />
                                <FormattedMessage id="users.notVerified" defaultMessage="Not verified" description="Not verified">
                                    {(text) => (
                                        <FormLabel className={!this.state.isProfileVerified ? 'active' : ''}>{text}</FormLabel>
                                    )}
                                </FormattedMessage>
                                
                            </FormGroup>
                        </section>
                    </div>
                </div>
            </Grid>
        )
    };
}