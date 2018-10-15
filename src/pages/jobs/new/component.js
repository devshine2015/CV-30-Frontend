import React from 'react';
import {
    TextField, Grid, Button, Select, MenuItem, Menu, IconButton, Icon, FormControl,
    Input, Checkbox, ListItemText, FormControlLabel, Popover, Chip
} from '@material-ui/core';
import ReactPlayer from 'react-player';
import { FormattedMessage } from 'react-intl';
import { DatePicker } from 'material-ui-pickers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as yup from 'yup';
import uuid from 'uuid/v4';
import moment from 'moment';

import fields from '../../../constants/contact';
import Loader from '../../../components/Loader';
import { formatCurrency } from '../../../constants/utils';
import LocationInput from '../../../components/LocationInput';
import ImageUploader from '../../../components/imageUploader';
import { s3BucketURL } from '../../../constants/s3';
import SkillsInput from '../../../components/SkillsInput';
import { InputHOC, SelectHOC, ChipsHOC, JobSalary } from '../../../components/FormHOCs';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class NewJob extends React.Component {
    validation = {
        id: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        companyId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
        teamId: yup.string().trim().matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).required('Please choose a team'),
        title: yup.string().trim().max(255).required('Please enter a title.'),
        description: yup.string().trim(),
        idealCandidate: yup.string().trim(),
        phone: yup.string().trim().max(255).nullable(),
        email: yup.string().trim().max(255).nullable(),
        facebook: yup.string().trim().max(255).nullable(),
        linkedin: yup.string().trim().max(255).nullable(),
        // expireDate: yup.date().default(new Date()).min(new Date(), 'Cannot expire in the past.'),
        expireDate: yup.date(),
        location: yup.string().trim().max(255),
        jobBenefits: yup.array().of(yup.number().positive().integer()),
        jobTypes: yup.array().of(yup.number().positive().integer()),
        salary: yup.object().shape({
            amountMin: yup.number().positive().required().lessThan(yup.ref('amountMax')),
            amountMax: yup.number().positive().required(),
            currency: yup.string().required().matches(/(ron|eur)/, { excludeEmptyString: true }),
            isPublic: yup.boolean().required()
        }),
        activityField: yup.string().trim().max(255),
        imagePath: yup.string().trim().max(1024).nullable().url(),
        videoUrl: yup.string().trim().max(1024).nullable().url(),
        skills: yup.array().of(
            yup.number().positive().integer()
        ),
        status: yup.string().matches(/(draft|active|archived)/, { excludeEmptyString: true })
    }
    state = {
        formData: {
            id: (this.props.job && this.props.job.id) || uuid(),
            title: (this.props.job && this.props.job.title) || "",
            companyId: (this.props.job && this.props.job.companyId) || "",
            teamId: (this.props.job && this.props.job.teamId) || "",
            jobBenefits: (this.props.job && this.props.job.jobBenefits && this.props.job.jobBenefits.map(benefit => benefit.id)) || [],
            jobTypes: (this.props.job && this.props.job.jobTypes && this.props.job.jobTypes && this.props.job.jobTypes.map(type => type.id)) || [],
            salary: {
                amountMin: (this.props.job && this.props.job.salary && this.props.job.salary.amountMin) || 0,
                amountMax: (this.props.job && this.props.job.salary && this.props.job.salary.amountMax) || 1000,
                currency: (this.props.job && this.props.job.salary && this.props.job.salary.currency) || 'eur',
                isPublic: (this.props.job && this.props.job.salary && this.props.job.salary.isPublic) || false
            },
            activityField: (this.props.job && this.props.job.activityField) || "",
            skills: (this.props.job && this.props.job.skills && this.props.job.skills.map(skill => skill.id)) || [],
            expireDate: (this.props.job && this.props.job.expireDate) || moment(),
            location: (this.props.job && this.props.job.location) || "",
            imagePath: (this.props.job && this.props.job.imagePath) || "",
            videoUrl: (this.props.job && this.props.job.videoUrl) || "",
            status: (this.props.job && this.props.job.status) || "draft",
            description: (this.props.job && this.props.job.description) || "",
            idealCandidate: (this.props.job && this.props.job.idealCandidate) || "",
        },
        fieldsValidity: {
            title: (this.props.job && this.props.job.title) ? this.validation.title.isValid(this.props.job.title) : false,
            companyId: (this.props.job && this.props.job.companyId) ? this.validation.companyId.isValid(this.props.job.companyId) : false,
            teamId: (this.props.job && this.props.job.teamId) ? this.validation.teamId.isValid(this.props.job.teamId) : false,
            jobBenefits: (this.props.job && this.props.job.jobBenefits) ? this.validation.jobBenefits.isValid(this.props.job.jobBenefits.map(benefit => benefit.id)) : true,
            jobTypes: (this.props.job && this.props.job.jobTypes) ? this.validation.jobTypes.isValid(this.props.job.jobTypes.map(type => type.id)) : true,
            salary: (this.props.job && this.props.job.salary) ? this.validation.salary.isValid(this.props.job.salary) : false,
            activityField: (this.props.job && this.props.job.activityField) ? this.validation.activityField.isValid(this.props.job.activityField) : false,
            skills: (this.props.job && this.props.job.skills) ? this.validation.skills.isValid(this.props.job.skills.map(skill => skill.id)) : true,
            expireDate: (this.props.job && this.props.job.expireDate) ? this.validation.expireDate.isValid(this.props.job.expireDate) : false,
            location: (this.props.job && this.props.job.location) ? this.validation.location.isValid(this.props.job.location) : false,
            imagePath: (this.props.job && this.props.job.imagePath) ? this.validation.imagePath.isValid(this.props.job.imagePath) : true,
            videoUrl: (this.props.job && this.props.job.videoUrl) ? this.validation.videoUrl.isValid(this.props.job.videoUrl) : true,
            status: (this.props.job && this.props.job.status) ? this.validation.status.isValid(this.props.job.status) : true,
            description: (this.props.job && this.props.job.description) ? this.validation.description.isValid(this.props.job.description) : true,
            idealCandidate: (this.props.job && this.props.job.idealCandidate) ? this.validation.idealCandidate.isValid(this.props.job.idealCandidate) : true,
        },
        formStatus: {
            isValid: false
        }
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        return (
            this.state.formStatus.isValid !== nextState.formStatus.isValid
            || this.props.jobDependencies.loading !== nextProps.jobDependencies.loading
        );
    }
    handleChange = values => {
        let formData = { ...this.state.formData };
        let fieldsValidity = { ...this.state.fieldsValidity };
        values.map(item => {
            formData[item.field] = item.value;
            fieldsValidity[item.field] = item.valid;
            return null;
        });
        this.setState({
            formData,
            fieldsValidity,
            formStatus: {
                isValid: Object.keys(fieldsValidity).reduce((accumulator, currentValue) => accumulator && fieldsValidity[currentValue], true)
            }
        }, () => console.log(this.state));
    }
    render() {
    let {
        state: {
            anchorEl,
            imageUploadOpen,
            videoShareAnchor
        },
        skillsData: { skills: allSkills },
        jobDependencies: { loading, jobBenefits: allJobBenefits, jobTypes: allJobTypes, company },
        updateDescription, updateIdealCandidate, handleSliderChange, onSkillsChange,
        handleClick, handleClose, addField, removeTextField,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        openVideoShare, closeVideoShare,
        removeImage, removeVideo,
        handleDateChange,
        values, touched, errors, isSubmitting, handleSubmit, isValid
    } = this.props;
    if (loading) return null;
    const {
        id, title, companyId, teamId, jobBenefits, jobTypes, salary, activityField, skills, expireDate, location, imagePath, videoUrl, status, description, idealCandidate
    } = this.state.formData;
    // allJobBenefits = allJobBenefits.map(item => {
    //     item.icon = item.key.replace(/\b-([a-z])/g, function(all, char) { return char.toUpperCase() });
    //     item.icon = item.icon.charAt(0).toUpperCase() + item.icon.slice(1);
    //     return item;
    // });
    // const benefitsIcons = benefits.map()
    console.log("status => " + status);
    // console.log(allSkills);
    if (loading || !company) return <Loader />
    return (
        <div className='newJobRoot'>
            <div className='header'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <FormattedMessage id="jobs.new.jobTitle" defaultMessage="Job title\nJob title..." description="Job title">
                        {(text) => <InputHOC key="title" InputProps={{ classes: { input: 'titleInput' } }} updateFormState={this.handleChange} fullWidth={true} value={title} name="title" label={text.split("\n")[0]} placeholder={text.split("\n")[2]} schema={this.validation.title} />}
                    </FormattedMessage>
                    
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
            </div>
            <Grid container className='mainBody jobEdit'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <div className='jobEditForm'>
                        <section className='mediaUpload'>
                            <FormattedMessage id="articles.new.helperText" defaultMessage="Add/Edit images or embed video links." description="Add/Edit images or embed video links.">
                                {(text) => (
                                    <p className='helperText'>
                                       {text}
                                    </p>
                                )}
                            </FormattedMessage>

                            {(values.imagePath || (values.videoUrl && !videoShareAnchor)) ?
                                <React.Fragment>
                                    {values.imagePath &&
                                        <div className="imagePreview">
                                            <img src={`${s3BucketURL}${values.imagePath}`} className='previewImg' alt='job' />
                                            <IconButton className='removeBtn' onClick={removeImage}>
                                                <Icon>cancel</Icon>
                                            </IconButton>
                                        </div>
                                    }
                                    {(values.videoUrl && !values.imagePath && !videoShareAnchor) &&
                                        <div className="imagePreview">
                                            <ReactPlayer
                                                url={values.videoUrl}
                                                width='150px'
                                                height='150px'
                                                config={{
                                                    youtube: {
                                                        playerVars: {
                                                            showinfo: 0,
                                                            controls: 0,
                                                            modestbranding: 1,
                                                            loop: 1
                                                        }
                                                    }
                                                }}
                                                playing={false} />
                                            <IconButton className='removeBtn' onClick={removeVideo}>
                                                <Icon>cancel</Icon>
                                            </IconButton>
                                        </div>
                                    }
                                </React.Fragment>
                                : <React.Fragment>
                                    <FormattedMessage id="articles.new.addImage" defaultMessage="Add image" description="Add image">
                                        {(text) => (
                                            <Button className='mediaBtn' onClick={openImageUpload}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>

                                    <ImageUploader
                                        type='job'
                                        open={imageUploadOpen}
                                        onClose={closeImageUpload}
                                        onError={handleError}
                                        onSuccess={handleSuccess}
                                        id={values.id}
                                    />
                                    <FormattedMessage id="articles.new.shareVideo" defaultMessage="Share video" description="Share video">
                                        {(text) => (
                                            <Button className='mediaBtn' onClick={openVideoShare}>
                                                {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>

                                    <Popover
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        open={Boolean(videoShareAnchor)}
                                        anchorEl={videoShareAnchor}
                                        onClose={closeVideoShare}
                                        classes={{
                                            paper: 'promoEditPaper'
                                        }}
                                        disableBackdropClick
                                    >
                                        <div className='popupBody'>
                                            <FormattedMessage id="articles.new.videoUrl" defaultMessage="Video URL\nEnter video link..." description="Enter video link">
                                                {(text) => (
                                                    <TextField
                                                        name="videoUrl"
                                                        label={text.split("\n")[0]}
                                                        placeholder={text.split("\n")[1]}
                                                        className='textField'
                                                        fullWidth
                                                        // onBlur={handleBlur}
                                                        // onChange={handleChange}
                                                        value={values.videoUrl}
                                                        error={!!(touched.videoUrl && errors.videoUrl)}
                                                        helperText={touched.videoUrl && errors.videoUrl}
                                                    />
                                                )}
                                            </FormattedMessage>

                                            
                                        </div>
                                        <div className='popupFooter'>
                                            <IconButton
                                                onClick={closeVideoShare}
                                                className='footerCancel'
                                            >
                                                <Icon>close</Icon>
                                            </IconButton>
                                            <IconButton
                                                style={ !values.videoUrl || (touched.videoUrl && errors.videoUrl) ? { background: '#fff', color: '#aaa', border: '1px solid #aaa' } : {} }
                                                onClick={closeVideoShare}
                                                className='footerCheck'
                                                disabled={!values.videoUrl || (touched.videoUrl && errors.videoUrl)}
                                            >
                                                <Icon>done</Icon>
                                            </IconButton>
                                        </div>
                                    </Popover>
                                </React.Fragment>
                            }
                        </section>
                        <section className='jobDescription'>
                            <FormattedMessage id="jobs.new.descriptions" defaultMessage="Job \ndescription" description="Job description">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="company.brand.froalaEditor" defaultMessage="This is where the job description should be" description="This is where the job description should be">
                                { text => <InputHOC key="description" name="description" placeholder={text} value={description} updateFormState={this.handleChange} froala={true} /> }
                            </FormattedMessage>
                            
                        </section>
                        <section className='expireDate'>
                            <FormattedMessage id="jobs.new.expirationData" defaultMessage="Expiration \ndate" description="Expiration date">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.new.selectData" defaultMessage="Select expiration date." description="Select expiration date.">
                                {(text) => (
                                    <p className='helperText'>
                                        {text}
                                    </p>
                                )}
                            </FormattedMessage>
                            
                            <InputHOC key="expireDate" name="expireDate" value={expireDate} updateFormState={this.handleChange} date={true} />
                        </section>
                        <section className='benefits'>
                            <FormattedMessage id="jobs.new.jobBenefits" defaultMessage="Job \nbenefits" description="Job benefits">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            {/* <FormattedMessage id="jobs.new.benefitsPara" defaultMessage="Add job benefits." description="Add job benefits.">
                                {(text) => (
                                    <p className='helperText'>
                                        {text}
                                    </p>
                                )}
                            </FormattedMessage> */}
                            
                            <FormControl className='formControl' style={{ width: 'auto', display: 'inline', flexWrap: 'wrap' }}>
                                <ChipsHOC key="jobBenefits" name="jobBenefits" value={jobBenefits} options={allJobBenefits} multiple={true} />
                            </FormControl>
                        </section>
                        <section className='team'>
                            <FormattedMessage id="jobs.new.associatedTeam" defaultMessage="Associated \nteam" description="Associated team">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            {/* <FormattedMessage id="jobs.new.addTeam" defaultMessage="Add team." description="Add team.">
                                {(text) => (
                                    <p className='helperText'>
                                        {text}
                                    </p>
                                )}
                            </FormattedMessage> */}
                            
                            <Select
                                name='teamId'
                                // onChange={handleChange}
                                value={values.teamId}
                                style={{ width: '100%' }}
                                className='jobSelect'
                            >
                                <FormattedMessage id="jobs.new.selectTeamPara" defaultMessage="Select a team" description="Select a team">
                                    {(text) => (
                                        <MenuItem value="" disabled>
                                            <em>{text}</em>
                                        </MenuItem>
                                    )}
                                </FormattedMessage>
                                
                                {
                                    company && company.teams && company.teams.map(team => <MenuItem value={team.id} key={team.id}>{team.name}</MenuItem>)
                                }

                            </Select>
                        </section>
                        <section className='idealCandidate'>
                            <FormattedMessage id="jobs.new.idealCandidate" defaultMessage="Ideal \ncandidate" description="Ideal candidate">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.new.froalaCandidate" defaultMessage="Describe the ideal candidate..." description="Describe the ideal candidate">
                                { text => <InputHOC key="idealCandidate" name="idealCandidate" placeholder={text} value={idealCandidate} updateFormState={this.handleChange} froala={true} /> }
                            </FormattedMessage>
                            
                        </section>
                        <section className='activityType'>
                            <FormattedMessage id="jobs.new.activity" defaultMessage="Activity \nfield" description="Activity field">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            <FormattedMessage id="jobs.new.activityField" defaultMessage="Activity field\nActivity field..." description="Activity field">
                                { text => <InputHOC fullWidth={true} key="activityField" name="activityField" placeholder={text} value={activityField} updateFormState={this.handleChange} schema={this.validation.activityField} /> }
                            </FormattedMessage>
                            
                        </section>
                        <section className='skills'>
                            <FormattedMessage id="jobs.new.desirableSkills" defaultMessage="Desirable \nskills" description="Desirable skills">
                                {(text) => (    
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            
                            <FormControl className='formControl' style={{ width: 'auto', display: 'inline', flexWrap: 'wrap' }}>
                                <ChipsHOC key="skills" name="skills" value={skills} options={allSkills} multiple={true} />
                            </FormControl>
                            {/* <SkillsInput className='textField jobSelect' value={values.skills} onChange={onSkillsChange}/> */}
                        </section>
                        <section className='jobType'>
                            <FormattedMessage id="jobs.new.jobTypes" defaultMessage="Job \ntype" description="Job type">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            {/* <FormattedMessage id="jobs.new.selectJobTypes" defaultMessage="Select job type(s)." description="Select job type(s).">
                                {(text) => (
                                    <p className='helperText'>
                                        {text}
                                    </p>
                                )}
                            </FormattedMessage> */}
                            
                            <FormControl className='formControl' style={{ width: 'auto', display: 'inline', flexWrap: 'wrap' }}>
                                <ChipsHOC key="jobTypes" name="jobTypes" value={jobTypes} options={allJobTypes} multiple={false} />
                            </FormControl>
                            {/* <FormControl className='formControl' style={{ width: '100%' }}>
                                <Select
                                    multiple
                                    style={{ width: '100%' }}
                                    value={values.jobTypes}
                                    // onChange={handleChange}
                                    input={<Input name="jobTypes" />}
                                    renderValue={selected => selected.map(item => allJobTypes.find(jt => jt.id === item).title).join(', ')}
                                    className='jobSelect'
                                >
                                    {allJobTypes.map(jobType => (
                                        <MenuItem key={jobType.id} value={jobType.id}>
                                            <Checkbox checked={values.jobTypes.indexOf(jobType.id) > -1} />
                                            <ListItemText primary={jobType.title} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                        </section>
                        <section className='salary'>
                            <FormattedMessage id="jobs.new.salaryRange" defaultMessage="Salary \nrange" description="Salary range">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            
                            <JobSalary />
                            {/* <Range
                                style={{ width: '100%' }}
                                min={0}
                                max={5000}
                                defaultValue={[values.salary.amountMin, values.salary.amountMax]}
                                tipFormatter={value => `${value}${formatCurrency(values.salary.currency)}`}
                                step={50}
                                onChange={handleSliderChange}
                            /> */}
                        </section>
                        <section className='locationSection'>
                            <FormattedMessage id="jobs.new.location" defaultMessage="Location..." description="Location">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            <LocationInput
                                // updateFormState={val => handleChange({ target: { name: val[0].field, value: val[0].value }})}
                                updateFormState={this.handleChange}
                                value={values.location}
                                schema={this.validation.location}
                            />
                        </section>
                        <section className='jobStatus'>
                            <FormattedMessage id="jobs.new.selectStatus" defaultMessage="Select job status." description="Select job status.">
                                { text => <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2> }
                            </FormattedMessage>
                            
                            <FormControl className='formControl' style={{ width: 'auto', display: 'inline', flexWrap: 'wrap' }}>
                                <ChipsHOC key="status" name="status" value={status} options={['draft', 'active', 'archived'].map(item => ({ id: item, title: item }))} multiple={false} />
                            </FormControl>
                            {/* <FormControl className='formControl'>
                                <Select
                                    name='status'
                                    // onChange={handleChange}
                                    value={values.status}
                                    className='jobStatusSelect jobSelect'
                                >
                                    <FormattedMessage id="jobs.new.setStatus" defaultMessage="Set status" description="Set status">
                                        {(text) => (
                                            <MenuItem value="" disabled>
                                                <em>{text}</em>
                                            </MenuItem>
                                        )}
                                    </FormattedMessage>
                                    {
                                        ['draft', 'active', 'archived'].map(item => <MenuItem value={item} key={item}>{item.toUpperCase()}</MenuItem>)
                                    }
                                </Select>
                            </FormControl> */}
                        </section>
                    </div>
                </Grid>

                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <div className='fixed'>
                            <section className='contact'>
                                <FormattedMessage id="jobs.new.contactDetails" defaultMessage="Contact\ndetails" description="Contact details">
                                    {(text) => (
                                        <h2 className="columnTitle">
                                            {text.split("\n")[0]}&nbsp;<b>{text.split("\n")[1]}</b>
                                        </h2>
                                    )}
                                </FormattedMessage>
                                
                                <FormattedMessage id="jobs.new.addSection" defaultMessage="Add section" description="Add section">
                                    {(text) => (
                                        <p className='message'>
                                            {text}
                                        </p>
                                    )}
                                </FormattedMessage>
                                
                                <div>
                                    <FormattedMessage id="jobs.new.selectField" defaultMessage="Select field" description="Select field">
                                        {(text) => (
                                            <Button className='addContactFieldBtn'
                                                    aria-owns={anchorEl ? 'simple-menu' : null}
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                >
                                                    {text}
                                            </Button>
                                        )}
                                    </FormattedMessage>
                                    
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        {
                                            fields.map((item, index) => {
                                                let key = 'addField-' + index;
                                                let disabled = !!values[item.id] || values[item.id] === '';
                                                return <MenuItem onClick={() => addField(item.id)} key={key} disabled={disabled}>{item.text}</MenuItem>
                                            })
                                        }
                                    </Menu>
                                </div>
                                <div className='contactDetailsEditForm'>
                                    {
                                        Object.keys(values).map((key) => {
                                            const result = fields.find(field => field.id === key);
                                            if (result && values[result.id] !== null) {
                                                let text = result.text;
                                                return (
                                                    <div className='formGroup' key={key}>
                                                        <TextField
                                                            name={key}
                                                            label={text}
                                                            placeholder={text}
                                                            className='textField'
                                                            // onChange={handleChange}
                                                            value={values[key]}
                                                            InputProps={{
                                                                classes: {
                                                                    root: 'contactTextInputRoot',
                                                                    input: 'contactTextInput',
                                                                }
                                                            }}
                                                            InputLabelProps={{
                                                                className: 'contactFormLabel'
                                                            }}
                                                        />
                                                        <IconButton
                                                            className='removeBtn'
                                                            onClick={() => removeTextField(key)}
                                                        >
                                                            <Icon>
                                                                close
                                                        </Icon>
                                                        </IconButton>
                                                    </div>
                                                )
                                            } else
                                                return null;
                                        })
                                    }
                                </div>
                            </section>
                            <FormattedMessage id="job.save" defaultMessage="Save job">
                                {(text) => (
                                    <Button
                                        className='saveBtn'
                                        onClick={handleSubmit}
                                        style={{
                                            opacity: !isValid || isSubmitting ? 0.5 : 1
                                        }}
                                        disabled={!isValid || isSubmitting}
                                    >
                                        {text}
                                    </Button>
                                )}
                            </FormattedMessage>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
    }
}

export default NewJob;