import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import {
    TextField, Grid, Button, Select, MenuItem, FormControl, Input, Checkbox,
    ListItemText, IconButton, Icon, Menu, FormControlLabel, Popover, Chip
} from '@material-ui/core';
import { graphql } from 'react-apollo';
import ReactPlayer from 'react-player';
import { withFormik } from 'formik';
import { FormattedMessage } from 'react-intl';
import { DatePicker } from 'material-ui-pickers';
import * as benefits from '../../../../assets/benefits';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import fields from '../../../../constants/contact';
import { formatCurrency } from '../../../../constants/utils';
import { jobValidation } from '../../new/validations';

import { jobDependencies, handleJob, setFeedbackMessage, setEditMode } from '../../../../store/queries';
import { jobRefetch } from '../../../../store/refetch';
import Loader from '../../../../components/Loader';
import SkillsInput from '../../../../components/SkillsInput';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import LocationInput from '../../../../components/LocationInput';
import { jobsFolder, s3BucketURL } from '../../../../constants/s3';
import ImageUploader from '../../../../components/imageUploader';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const EditHOC = compose(
    graphql(jobDependencies, {
        name: 'jobDependencies',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                companyId: props.getJobQuery.job.company.id
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('state', 'setState', {
        anchorEl: null,
        imageUploadOpen: false,
        videoShareAnchor: null
    }),
    withFormik({
        mapPropsToValues: ({ getJobQuery: { job } }) => {
            if (!job)
                return {};

            const { id, title, activityField, description, idealCandidate, company: { id: companyId }, team: { id: teamId },
                expireDate, jobTypes, location, salary: { amountMax, amountMin, currency, isPublic },
                skills, imagePath, videoUrl, status, jobBenefits, phone, email, facebook, linkedin } = job;

            return {
                id,
                title,
                companyId,
                teamId,
                jobBenefits: jobBenefits ? jobBenefits.map(benefit => benefit.id) : [],
                jobTypes: jobTypes ? jobTypes.map(jobType => jobType.id) : [],
                salary: { amountMax, amountMin, currency, isPublic },
                activityField: (activityField && activityField.title) || '',
                skills: skills ? skills.map(skill => skill.id) : [],
                expireDate: new Date(expireDate).toISOString().split("T")[0],
                location,
                imagePath,
                videoUrl,
                status,
                description,
                idealCandidate,
                phone,
                email,
                facebook,
                linkedin
            };
        },
        validationSchema: jobValidation,
        displayName: 'EditJobForm',
        handleSubmit: async (values, { props: { handleJob, match: { params: { lang: language, jobId } }, setFeedbackMessage, setEditMode }, setSubmitting }) => {
            setSubmitting(true);
            try {
                await handleJob({
                    variables: {
                        language,
                        jobDetails: values
                    },
                    refetchQueries: [jobRefetch(jobId, language)]
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
    }),
    withHandlers({
        handleDateChange: ({ setFieldValue }) => expireDate => setFieldValue('expireDate', expireDate),
        updateDescription: ({ setFieldValue }) => text => setFieldValue('description', text),
        updateIdealCandidate: ({ setFieldValue }) => text => setFieldValue('idealCandidate', text),
        handleSliderChange: ({ setFieldValue, values }) => value => {
            setFieldValue('salary', {
                ...values.salary,
                amountMin: value[0],
                amountMax: value[1],
            });
        },
        onSkillsChange: ({ setFieldValue }) => skills => setFieldValue('skills', skills),
        addField: ({ state, setState, setFieldValue }) => fieldId => {
            setFieldValue(fieldId, '');
            setState({ ...state, anchorEl: null });
        },
        removeTextField: ({ setFieldValue }) => key => setFieldValue(key, null),
        handleClick: ({ state, setState }) => event => setState({ ...state, anchorEl: event.currentTarget }),
        handleClose: ({ state, setState }) => () => setState({ ...state, anchorEl: null }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setFieldValue, values: { id } }) => ({ path, filename }) =>
            setFieldValue('imagePath', path ? path : `/${jobsFolder}/${id}/${filename}`),
        removeImage: ({ setFieldValue }) => () => setFieldValue('imagePath', null),
        removeVideo: ({ setFieldValue }) => () => setFieldValue('videoUrl', null),
        openVideoShare: ({ state, setState }) => ev => setState({ ...state, videoShareAnchor: ev.target }),
        closeVideoShare: ({ state, setState }) => () => setState({ ...state, videoShareAnchor: null })
    }),
    pure
);
const Edit = props => {
    const {
        state: {
            anchorEl,
            imageUploadOpen,
            videoShareAnchor
        },
        jobDependencies: { loading, jobBenefits, jobTypes, company },
        updateDescription, updateIdealCandidate, handleSliderChange, onSkillsChange,
        handleClick, handleClose, addField, removeTextField,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        openVideoShare, closeVideoShare,
        removeImage, removeVideo,
        handleDateChange,
        values, touched, errors, isSubmitting, handleBlur, handleChange, handleSubmit, isValid
    } = props;

    if (loading) return <Loader />
    return (
        <React.Fragment>
            <div className='header'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <TextField
                        name="title"
                        label="Job title"
                        placeholder="Job title..."
                        className='textField'
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        error={!!(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                        InputProps={{
                            classes: {
                                input: 'titleInput',
                            },
                        }}
                    />
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
            </div>
            <Grid container className='mainBody jobEdit'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <form className='jobEditForm' noValidate autoComplete='off'>
                        <section className='mediaUpload'>
                            <p className='helperText'>
                                Add/Edit images or embed video links.
                            </p>

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
                                    <Button className='mediaBtn' onClick={openImageUpload}>
                                        Add image
                                    </Button>

                                    <ImageUploader
                                        type='job'
                                        open={imageUploadOpen}
                                        onClose={closeImageUpload}
                                        onError={handleError}
                                        onSuccess={handleSuccess}
                                        id={values.id}
                                    />

                                    <Button className='mediaBtn' onClick={openVideoShare}>
                                        Share video
                                    </Button>

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
                                            <TextField
                                                name="videoUrl"
                                                label="Video URL"
                                                placeholder="Enter video link..."
                                                className='textField'
                                                fullWidth
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.videoUrl}
                                                error={!!(touched.videoUrl && errors.videoUrl)}
                                                helperText={touched.videoUrl && errors.videoUrl}
                                            />
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
                            <h2 className='sectionTitle'>Job <b>description</b></h2>
                            <FroalaEditor
                                config={{
                                    placeholderText: 'This is where the job description should be',
                                    iconsTemplate: 'font_awesome_5',
                                    toolbarInline: true,
                                    charCounterCount: false,
                                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                }}
                                model={values.description}
                                onModelChange={updateDescription}
                            />
                        </section>
                        <section className='expireDate'>
                            <h2 className='sectionTitle'>Expiration <b>date</b></h2>
                            <p className='helperText'>
                                Select expiration date.
                            </p>
                            <DatePicker
                                format="DD/MM/YYYY"
                                disablePast={true}
                                value={values.expireDate}
                                onBlur={handleBlur}
                                onChange={handleDateChange}
                                animateYearScrolling
                            />
                            {/* <TextField
                                name="expireDate"
                                type="date"
                                className='jobSelect'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.expireDate}
                                error={!!(touched.expireDate && errors.expireDate)}
                                helperText={touched.expireDate && errors.expireDate}
                            /> */}
                        </section>
                        <section className='benefits'>
                            <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                            <p className='helperText'>
                                Add job benefits.
                            </p>
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
                                    {jobBenefits && jobBenefits.map(benefit => (
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
                            <h2 className='sectionTitle'>Associated <b>team</b></h2>
                            <p className='helperText'>
                                Add team.
                            </p>
                            <Select
                                name='teamId'
                                onChange={handleChange}
                                value={values.teamId}
                                className='jobSelect'
                            >
                                <MenuItem value="" disabled>
                                    <em>Select a team</em>
                                </MenuItem>
                                {
                                    company && company.teams && company.teams.map(team => <MenuItem value={team.id} key={team.id}>{team.name}</MenuItem>)
                                }

                            </Select>
                        </section>
                        <section className='idealCandidate'>
                            <h2 className='sectionTitle'>Ideal <b>candidate</b></h2>
                            <FroalaEditor
                                config={{
                                    placeholderText: 'Describe the ideal candidate...',
                                    iconsTemplate: 'font_awesome_5',
                                    toolbarInline: true,
                                    charCounterCount: false,
                                    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                }}
                                model={values.idealCandidate}
                                onModelChange={updateIdealCandidate}
                            />
                        </section>
                        <section className='activityType'>
                            <h2 className='sectionTitle'>Activity <b>field</b></h2>
                            <TextField
                                name="activityField"
                                label="Activity field"
                                placeholder="Activity field..."
                                className='textField jobSelect'
                                onChange={handleChange}
                                value={values.activityField}
                            />
                        </section>
                        <section className='skills'>
                            <h2 className='sectionTitle'>Desirable <b>skills</b></h2>
                            <SkillsInput className='textField jobSelect' value={values.skills} onChange={onSkillsChange}/>
                        </section>
                        <section className='jobType'>
                            <h2 className='sectionTitle'>Job <b>type</b></h2>
                            <p className='helperText'>
                                Select job type(s).
                            </p>
                            <FormControl className='formControl'>
                                <Select
                                    multiple
                                    value={values.jobTypes}
                                    onChange={handleChange}
                                    input={<Input name="jobTypes" />}
                                    renderValue={selected => selected.map(item => jobTypes.find(jt => jt.id === item).title).join(', ')}
                                    className='jobSelect'
                                >
                                    {jobTypes && jobTypes.map(jobType => (
                                        <MenuItem key={jobType.id} value={jobType.id}>
                                            <Checkbox checked={values.jobTypes.indexOf(jobType.id) > -1} />
                                            <ListItemText primary={jobType.title} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </section>
                        <section className='salary'>
                            <h2 className='sectionTitle'>Salary <b>range</b></h2>
                            <Range
                                min={0}
                                max={5000}
                                defaultValue={[values.salary.amountMin, values.salary.amountMax]}
                                tipFormatter={value => `${value}${formatCurrency(values.salary.currency)}`}
                                step={50}
                                onChange={handleSliderChange}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox name="salary.isPublic" checked={values.salary.isPublic} onChange={handleChange} />
                                }
                                label="Public" />
                        </section>
                        <section className='locationSection'>
                            <LocationInput
                                value={values.location}
                                onChange={handleChange}
                                className='jobSelect'
                            />
                        </section>
                        <section className='jobStatus'>
                            <p className='helperText'>
                                Select job status.
                            </p>
                            <FormControl className='formControl'>
                                <Select
                                    name='status'
                                    onChange={handleChange}
                                    value={values.status}
                                    className='jobStatusSelect jobSelect'
                                >
                                    <MenuItem value="" disabled>
                                        <em>Set status</em>
                                    </MenuItem>
                                    {
                                        ['draft', 'active', 'archived'].map(item => <MenuItem value={item} key={item}>{item.toUpperCase()}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </section>
                    </form>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <div className='fixed'>
                            <section className='contact'>
                                <h2 className="columnTitle">
                                    Contact&nbsp;<b>details</b>
                                </h2>

                                <p className='message'>
                                    Add section
                            </p>
                                <div>
                                    <Button className='addContactFieldBtn'
                                        aria-owns={anchorEl ? 'teamSelect' : null}
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        Select field
                                </Button>
                                    <Menu
                                        id="teamSelect"
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
        </React.Fragment>
    );
}

export default EditHOC(Edit);
