import React from 'react';
import {
    TextField, Grid, Button, Select, MenuItem, Menu, IconButton, Icon, FormControl,
    Input, Checkbox, ListItemText, FormControlLabel, Popover, Chip
} from '@material-ui/core';
import ReactPlayer from 'react-player';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import fields from '../../../constants/contact';
import BenefitsList from '../../../constants/benefits';
import Loader from '../../../components/Loader';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import TagsInput from '../../../components/TagsInput';
import { formatCurrency } from '../../../constants/utils';

import LocationInput from '../../../components/LocationInput';
import ImageUploader from '../../../components/imageUploader';
import { s3BucketURL } from '../../../constants/s3';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const NewJob = props => {
    const {
        teamsQuery,
        jobTypesQuery
    } = props;

    if (teamsQuery.loading || jobTypesQuery.loading)
        return <Loader />

    const {
        updateDescription, updateIdealCandidate, handleSliderChange, onSkillsChange,
        anchorEl, handleClick, handleClose, addField, removeTextField,
        openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess,
        openVideoShare, closeVideoShare, videoShareAnchor,
        removeImage, removeVideo,
        //formik
        values, touched, errors, isSubmitting, handleBlur, handleChange, handleSubmit, isValid
    } = props;

    return (
        <div className='newJobRoot'>
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
                    <div className='jobEditForm'>
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
                                                className='footerCheck'
                                                disabled={(!!values.videoUrl && touched.videoUrl && errors.videoUrl)}
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
                            <TextField
                                name="expireDate"
                                type="date"
                                className='jobSelect'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.expireDate}
                                error={!!(touched.expireDate && errors.expireDate)}
                                helperText={touched.expireDate && errors.expireDate}
                            />
                        </section>
                        <section className='benefits'>
                            <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                            <p className='helperText'>
                                Add job benefits.
                            </p>
                            <FormControl className='formControl'>
                                <Select
                                    multiple
                                    value={values.benefits}
                                    onChange={handleChange}
                                    input={<Input name="benefits" />}
                                    renderValue={selected => (
                                        <div className='selectedBenefits'>
                                            {selected.map(value => (
                                                <Chip key={value} label={value} className='chip' />
                                            ))}
                                        </div>
                                    )}
                                    className='jobSelect'
                                >
                                    {BenefitsList.map(benefit => (
                                        <MenuItem key={benefit.id} value={benefit.id}>
                                            <Checkbox checked={values.benefits.indexOf(benefit.id) > -1} />
                                            <i className={benefit.icon} />
                                            <ListItemText primary={benefit.label} />
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
                                    teamsQuery.teams && teamsQuery.teams.map(team => <MenuItem value={team.id} key={team.id}>{team.name}</MenuItem>)
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
                            <TagsInput value={values.skills} onChange={onSkillsChange} helpTagName='skill' className='textField jobSelect' />
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
                                    renderValue={selected => selected.map(item => jobTypesQuery.jobTypes.find(jt => jt.id === item).i18n[0].title).join(', ')}
                                    className='jobSelect'
                                >
                                    {jobTypesQuery.jobTypes.map(jobType => (
                                        <MenuItem key={jobType.id} value={jobType.id}>
                                            <Checkbox checked={values.jobTypes.indexOf(jobType.id) > -1} />
                                            <ListItemText primary={jobType.i18n[0].title} />
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
                    </div>
                </Grid>

                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                    <div className='columnRightContent'>
                        <section className='contact'>
                            <h2 className="columnTitle">
                                Contact&nbsp;<b>details</b>
                            </h2>

                            <p className='message'>
                                Add section
                            </p>
                            <div>
                                <Button className='addContactFieldBtn'
                                    aria-owns={anchorEl ? 'simple-menu' : null}
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    Select field
                                </Button>
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
                                        if (result) {
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
                        <Button
                            className='saveBtn'
                            onClick={handleSubmit}
                            disabled={!isValid || isSubmitting}
                        >
                            Publish job
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default NewJob;