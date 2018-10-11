import React from 'react';
import {
    TextField, Grid, Button, Select, MenuItem, Menu, IconButton, Icon, FormControl,
    Input, Checkbox, ListItemText, FormControlLabel, Popover, Chip
} from '@material-ui/core';
import ReactPlayer from 'react-player';
import { FormattedMessage } from 'react-intl';
import { DatePicker } from 'material-ui-pickers';
import * as benefits from '../../../assets/benefits';
import uuid from 'uuidv4';
// import { InputHOC, PeriodDatePickers, Media } from '../../../../';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import fields from '../../../constants/contact';
import Loader from '../../../components/Loader';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { formatCurrency } from '../../../constants/utils';

import LocationInput from '../../../components/LocationInput';
import ImageUploader from '../../../components/imageUploader';
import { s3BucketURL } from '../../../constants/s3';
import SkillsInput from '../../../components/SkillsInput';
import { jobsFolder } from '../../../constants/s3';
import { jobValidation } from './validations';
import { InputHOC } from '../../../components/FormHOCs';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class NewJob extends React.Component {
    
    constructor (props) {
        super(props)
        console.log(props.location)
        this.state = {
            anchorEl: null,
            imageUploadOpen: false,
            videoShareAnchor: null,
            formData: {
                id: uuid(),
                title: '',
                companyId: props.location.companyId,
                teamId: props.location.teamId || '',
                jobBenefits: [],
                jobTypes: [],
                salary: {
                    amountMin: 0,
                    amountMax: 1000,
                    currency: 'eur',
                    isPublic: false
                },
                activityField: '',
                skills: [],
                expireDate: new Date().toISOString().split("T")[0],
                location: '',
                imagePath: '',
                videoUrl: '',
                status: 'draft',
                description: '',
                idealCandidate: ''
            },
            fieldsValidity: {
                title: false,
                teamId: ( props.location && props.location.teamId )? jobValidation.teamId.isValid(props.location.teamId) : false,
                jobBenefits: false,
                jobTypes: false,
                salary: false,
                activityField: false,
                skills: false,
                expireDate: false,
                location: false,
                imagePath: false,
                videoUrl: false,
                status: false,
            },
            formStatus: {
                isValid: false
            }
        }
    }
    handleSubmit = async () => {
        
        const { handleJob, match: { params: { lang: language } }, history, setFeedbackMessage, setEditMode , setSubmitting } = this.props
        const values = this.state.formData

        setSubmitting(true);
        try {
            await handleJob({
                variables: {
                    language,
                    jobDetails: values
                }
            });
            await setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'Changes saved successfully.'
                }
            });
            setSubmitting(false);
            await setEditMode({
                variables: {
                    status: false
                }
            });
            history.push(`/${language}/job/${values.id}`);
        }
        catch (err) {
            setSubmitting(false);
            console.log(err);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: err.message
                }
            });
        }
    }

    handleDateChange = expireDate => { 
        this.setState({
            formData: {
                expireDate
            }
        })
    }

    handleClick = event => { 
        const state = this.state
        this.setState({ ...state, anchorEl: event.currentTarget })
    } 

    handleClose = () => {
        const state = this.state
        this.setState({ ...state, anchorEl: null })
    }

    addField = fieldId => {
        const state = this.state
        
        this.setState({ ...state, anchorEl: null });
    }

    removeTextField = key => { 
       
    }

    updateDescription = text => {
        
        this.setState({
            formData: {
                description: text
            }
        })
    }

    updateIdealCandidate = text => { 
        
        this.setState({
            formData: {
                idealCandidate: text
            }
        })
    }

    handleSliderChange = value => {
        this.setState({
            formData: {
                salary: {
                    amountMin: value[0],
                    amountMax: value[1],
                }
            }
        })
    }

    onSkillsChange = skills => {
        this.setState({
            formData: {
                skills
            }
        })
    }

    openImageUpload = () => { 
        const state = this.state
        this.setState({ ...state, imageUploadOpen: true })
    }

    closeImageUpload = () => {
        const state = this.state
        this.setState({ ...state, imageUploadOpen: false })
    }

    handleError = async error => {
        const { setFeedbackMessage } = this.props
        console.log(error);
        await setFeedbackMessage({
            variables: {
                status: 'error',
                message: error || error.message
            }
        });
    }

    handleSuccess = ({ path, filename }) => { 
        const { id } = this.state.formData
        
        this.setState({
            formData: {
                imagePath: path ? path : `/${jobsFolder}/${id}/${filename}`
            }
        })
    }

    removeImage = () => { 
        this.setState({
            formData: {
                imagePath: null
            }
        })
    }

    removeVideo = () =>  { 
        this.setState({
            formData: {
                videoUrl: null
            }
        })
    }

    openVideoShare = ev => { 
        const state = this.state
        this.setState({ ...state, videoShareAnchor: ev.target })
    }

    closeVideoShare = () => {
        const state = this.state
        this.setState({ ...state, videoShareAnchor: null })
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

    render () {
        const values = this.state.formData
        const {
            jobDependencies: { loading, jobBenefits, jobTypes, company },
            touched, errors, isSubmitting, handleBlur, handleChange, isValid
        } = this.props;
        
        const { 
            anchorEl,
            imageUploadOpen,
            videoShareAnchor
        } = this.state

        const { id, title, companyId, teamId, salary, activityField, skills, expireDate, location, imagePath, videoUrl, status, description, idealCandidate } = this.state.formData

        return (
            <div className='newJobRoot'>
                {
                    (loading || !company) &&
                    <Loader />
                }
                <div className='header'>
                    <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                        <FormattedMessage id="jobs.new.jobTitle" defaultMessage="Job title\nJob title..." description="Job title">
                            {(text) => <InputHOC key="title" updateFormState={this.handleChange} fullWidth={true}  value={title} name="title" label={text.split("\n")[0]} placeholder={text.split("\n")[2]} schema={this.validation.position} /> }
                            {/* (
                                <TextField
                                    name="title"
                                    label={text.split("\n")[0]}
                                    placeholder={text.split("\n")[2]}
                                    className='textField'
                                    fullWidth
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={title}
                                    // error={!!(touched.title && errors.title)}
                                    // helperText={touched.title && errors.title}
                                    InputProps={{
                                        classes: {
                                            input: 'titleInput',
                                        },
                                    }}
                                />
                            )} */}
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
    
                                {(imagePath || (videoUrl && !videoShareAnchor)) ?
                                    <React.Fragment>
                                        {imagePath &&
                                            <div className="imagePreview">
                                                <img src={`${s3BucketURL}${imagePath}`} className='previewImg' alt='job' />
                                                <IconButton className='removeBtn' onClick={this.removeImage}>
                                                    <Icon>cancel</Icon>
                                                </IconButton>
                                            </div>
                                        }
                                        {(videoUrl && !imagePath && !videoShareAnchor) &&
                                            <div className="imagePreview">
                                                <ReactPlayer
                                                    url={videoUrl}
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
                                                <IconButton className='removeBtn' onClick={this.removeVideo}>
                                                    <Icon>cancel</Icon>
                                                </IconButton>
                                            </div>
                                        }
                                    </React.Fragment>
                                    : <React.Fragment>
                                        <FormattedMessage id="articles.new.addImage" defaultMessage="Add image" description="Add image">
                                            {(text) => (
                                                <Button className='mediaBtn' onClick={this.openImageUpload}>
                                                    {text}
                                                </Button>
                                            )}
                                        </FormattedMessage>
    
                                        <ImageUploader
                                            type='job'
                                            open={imageUploadOpen}
                                            onClose={this.closeImageUpload}
                                            onError={this.handleError}
                                            onSuccess={this.handleSuccess}
                                            id={id}
                                        />
                                        <FormattedMessage id="articles.new.shareVideo" defaultMessage="Share video" description="Share video">
                                            {(text) => (
                                                <Button className='mediaBtn' onClick={this.openVideoShare}>
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
                                            onClose={this.closeVideoShare}
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
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={videoUrl}
                                                            // error={!!(touched.videoUrl && errors.videoUrl)}
                                                            // helperText={touched.videoUrl && errors.videoUrl}
                                                        />
                                                    )}
                                                </FormattedMessage>
    
                                                
                                            </div>
                                            <div className='popupFooter'>
                                                <IconButton
                                                    onClick={this.closeVideoShare}
                                                    className='footerCancel'
                                                >
                                                    <Icon>close</Icon>
                                                </IconButton>
                                                <IconButton
                                                    style={ !videoUrl || (touched.videoUrl && errors.videoUrl) ? { background: '#fff', color: '#aaa', border: '1px solid #aaa' } : {} }
                                                    onClick={this.closeVideoShare}
                                                    className='footerCheck'
                                                    disabled={!videoUrl || (touched.videoUrl && errors.videoUrl)}
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
                                    {(text) => (
                                        <FroalaEditor
                                            config={{
                                                placeholderText: text,
                                                iconsTemplate: 'font_awesome_5',
                                                toolbarInline: true,
                                                charCounterCount: false,
                                                toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                            }}
                                            model={description}
                                            onModelChange={this.updateDescription}
                                        />
                                    )}
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
                                
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    disablePast={true}
                                    value={expireDate}
                                    onBlur={handleBlur}
                                    onChange={this.handleDateChange}
                                    animateYearScrolling
                                />
                                {/* <TextField
                                    name="expireDate"
                                    type="date"
                                    className='jobSelect'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={expireDate}
                                    error={!!(touched.expireDate && errors.expireDate)}
                                    helperText={touched.expireDate && errors.expireDate}
                                /> */}
                            </section>
                            <section className='benefits'>
                                <FormattedMessage id="jobs.new.jobBenefits" defaultMessage="Job \nbenefits" description="Job benefits">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                <FormattedMessage id="jobs.new.benefitsPara" defaultMessage="Add job benefits." description="Add job benefits.">
                                    {(text) => (
                                        <p className='helperText'>
                                            {text}
                                        </p>
                                    )}
                                </FormattedMessage>
                                
                                <FormControl className='formControl'>
                                    <Select
                                        multiple
                                        value={values.jobBenefits}
                                        onChange={handleChange}
                                        input={<Input name="jobBenefits" />}
                                        renderValue={selected => (
                                            <div className='selectedBenefits'>
                                                {selected.map(id => {
                                                    let benefit = jobBenefits.find(benefit => benefit.id === id);
                                                    if (benefit)
                                                        return (
                                                            <FormattedMessage id={`benefits.${benefit.key}`} defaultMessage={benefit.key} key={benefit.key}>
                                                                {(text) => <Chip label={text} className='chip' />}
                                                            </FormattedMessage>
                                                        )
                                                    else
                                                        return null;
                                                })}
                                            </div>
                                        )}
                                        className='jobSelect'
                                    >
                                        {jobBenefits.map(benefit => (
                                            <MenuItem key={benefit.id} value={benefit.id}>
                                                <Checkbox checked={values.jobBenefits.indexOf(benefit.id) > -1} />
                                                <img style={{ marginRight: '10px', width: '20px' }} src={benefits[benefit.key.replace(/\b-([a-z])/g, function(all, char) { return char.toUpperCase() })]} alt={benefit.key} />
                                                <FormattedMessage id={`benefits.${benefit.key}`} defaultMessage={benefit.key}>
                                                    {(text) => <ListItemText primary={text} />}
                                                </FormattedMessage>
    
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </section>
                            <section className='team'>
                                <FormattedMessage id="jobs.new.associatedTeam" defaultMessage="Associated \nteam" description="Associated team">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[0]}</b></h2>
                                    )}
                                </FormattedMessage>
                                <FormattedMessage id="jobs.new.addTeam" defaultMessage="Add team." description="Add team.">
                                    {(text) => (
                                        <p className='helperText'>
                                            {text}
                                        </p>
                                    )}
                                </FormattedMessage>
                                
                                <Select
                                    name='teamId'
                                    onChange={handleChange}
                                    value={teamId}
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
                                    {(text) => (
                                        <FroalaEditor
                                            config={{
                                                placeholderText: text,
                                                iconsTemplate: 'font_awesome_5',
                                                toolbarInline: true,
                                                charCounterCount: false,
                                                toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                            }}
                                            model={idealCandidate}
                                            onModelChange={this.updateIdealCandidate}
                                        />
                                    )}
                                </FormattedMessage>
                                
                            </section>
                            <section className='activityType'>
                                <FormattedMessage id="jobs.new.activity" defaultMessage="Activity \nfield" description="Activity field">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                <FormattedMessage id="jobs.new.activityField" defaultMessage="Activity field\nActivity field..." description="Activity field">
                                    {(text) => (
                                        <TextField
                                            name="activityField"
                                            label={text.split("\n")[0]}
                                            placeholder={text.split("\n")[1]}
                                            className='textField jobSelect'
                                            onChange={handleChange}
                                            value={activityField}
                                        />
                                    )}
                                </FormattedMessage>
                                
                            </section>
                            <section className='skills'>
                                <FormattedMessage id="jobs.new.desirableSkills" defaultMessage="Desirable \nskills" description="Desirable skills">
                                    {(text) => (    
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                
                                <SkillsInput className='textField jobSelect' value={skills} onChange={this.onSkillsChange}/>
                            </section>
                            <section className='jobType'>
                                <FormattedMessage id="jobs.new.jobTypes" defaultMessage="Job \ntype" description="Job type">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                <FormattedMessage id="jobs.new.selectJobTypes" defaultMessage="Select job type(s)." description="Select job type(s).">
                                    {(text) => (
                                        <p className='helperText'>
                                            {text}
                                        </p>
                                    )}
                                </FormattedMessage>
                                
                                <FormControl className='formControl'>
                                    <Select
                                        multiple
                                        value={values.jobTypes}
                                        onChange={handleChange}
                                        input={<Input name="jobTypes" />}
                                        renderValue={selected => selected.map(item => jobTypes.find(jt => jt.id === item).title).join(', ')}
                                        className='jobSelect'
                                    >
                                        {jobTypes.map(jobType => (
                                            <MenuItem key={jobType.id} value={jobType.id}>
                                                <Checkbox checked={values.jobTypes.indexOf(jobType.id) > -1} />
                                                <ListItemText primary={jobType.title} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </section>
                            <section className='salary'>
                                <FormattedMessage id="jobs.new.salaryRange" defaultMessage="Salary \nrange" description="Salary range">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                
                                <Range
                                    min={0}
                                    max={5000}
                                    defaultValue={[salary.amountMin, salary.amountMax]}
                                    tipFormatter={value => `${value}${formatCurrency(salary.currency)}`}
                                    step={50}
                                    onChange={this.handleSliderChange}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox name="salary.isPublic" checked={salary.isPublic} onChange={handleChange} />
                                    }
                                    label="Public" />
                            </section>
                            <section className='locationSection'>
                                <LocationInput
                                    updateformData={val => handleChange({ target: { name: val[0].field, value: val[0].value }})}
                                    value={location}
                                    // schema={this.validation.location}
                                />
                            </section>
                            <section className='jobStatus'>
                                <FormattedMessage id="jobs.new.selectStatus" defaultMessage="Select job status." description="Select job status.">
                                    {(text) => (
                                        <p className='helperText'>
                                            {text}
                                        </p>
                                    )}
                                </FormattedMessage>
                                
                                <FormControl className='formControl'>
                                    <Select
                                        name='status'
                                        onChange={handleChange}
                                        value={status}
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
                                </FormControl>
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
                                                        onClick={this.handleClick}
                                                    >
                                                        {text}
                                                </Button>
                                            )}
                                        </FormattedMessage>
                                        
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={this.handleClose}
                                        >
                                            {
                                                fields.map((item, index) => {
                                                    let key = 'addField-' + index;
                                                    let disabled = !!values[item.id] || values[item.id] === '';
                                                    return <MenuItem onClick={() => this.addField(item.id)} key={key} disabled={disabled}>{item.text}</MenuItem>
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
                                                                onChange={handleChange}
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
                                                                onClick={() => this.removeTextField(key)}
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
                                            onClick={this.handleSubmit}
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