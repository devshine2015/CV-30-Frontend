import React from 'react';
import { TextField, Grid, Button, Select, MenuItem, Menu, IconButton, Icon, FormControl, Input, Checkbox, ListItemText } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';

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
import JobTypes from '../../../constants/jobTypes';
import Loader from '../../../components/Loader';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const NewJob = props => {
    const {
        formData: { title, expireDate, teamId, benefits, description, idealCandidate, activityField, skills, jobTypes },
        handleFormChange, updateDescription, updateIdealCandidate, handleSliderChange, publishJob,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading,
        teamsQuery: { loading, teams },
        anchorEl, handleClick, handleClose, addField, formData, removeTextField
    } = props;

    if (loading)
        return <Loader />

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
                        onChange={handleFormChange}
                        value={title || ''}
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
                            <label htmlFor="uploadJobImage">
                                <S3Uploader
                                    id="uploadJobImage"
                                    name="uploadJobImage"
                                    className='hiddenInput'
                                    getSignedUrl={getSignedUrl}
                                    accept="image/*"
                                    preprocess={onUploadStart}
                                    onProgress={onProgress}
                                    onError={onError}
                                    onFinish={onFinishUpload}
                                    uploadRequestHeaders={{
                                        'x-amz-acl': 'public-read',
                                    }}
                                />
                                <Button component='span' className='mediaBtn' disabled={isUploading}>
                                    Add image
                                </Button>
                            </label>
                            <Button className='mediaBtn'>
                                Share video
                            </Button>
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
                                model={description}
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
                                value={expireDate ? (new Date(expireDate)).toISOString().split("T")[0] : (new Date()).toISOString().split("T")[0]}
                                onChange={handleFormChange}
                                className='jobSelect'
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
                                    value={benefits}
                                    onChange={handleFormChange}
                                    input={<Input name="benefits" />}
                                    renderValue={selected => selected.join(', ')}
                                    className='jobSelect'
                                >
                                    {BenefitsList.map(benefit => (
                                        <MenuItem key={benefit.id} value={benefit.id}>
                                            <Checkbox checked={benefits.indexOf(benefit.id) > -1} />
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
                                onChange={handleFormChange}
                                value={teamId || ''}
                                className='jobSelect'
                            >
                                <MenuItem value="" disabled>
                                    <em>Select a team</em>
                                </MenuItem>
                                {
                                    teams && teams.map(team => <MenuItem value={team.id} key={team.id}>{team.name}</MenuItem>)
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
                                model={idealCandidate}
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
                                onChange={handleFormChange}
                                value={activityField || ''}
                            />
                        </section>
                        <section className='skills'>
                            <h2 className='sectionTitle'>Desirable <b>skills</b></h2>
                            <TextField
                                name="skills"
                                label="Skills"
                                placeholder="Skills..."
                                className='textField jobSelect'
                                onChange={handleFormChange}
                                value={skills || ''}
                            />
                        </section>
                        <section className='jobType'>
                            <h2 className='sectionTitle'>Job <b>type</b></h2>
                            <p className='helperText'>
                                Select job type(s).
                            </p>
                            <FormControl className='formControl'>
                                <Select
                                    multiple
                                    value={jobTypes}
                                    onChange={handleFormChange}
                                    input={<Input name="jobTypes" />}
                                    renderValue={selected => selected.join(', ')}
                                    className='jobSelect'
                                >
                                    {JobTypes.map(jobType => (
                                        <MenuItem key={jobType.id} value={jobType.id}>
                                            <Checkbox checked={jobTypes.indexOf(jobType.id) > -1} />
                                            <ListItemText primary={jobType.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </section>
                        <section className='salary'>
                            <h2 className='sectionTitle'>Salary <b>range</b></h2>
                            <Range min={0} max={5000} defaultValue={[0, 1000]} tipFormatter={value => `${value}E`} step={50} onChange={handleSliderChange} />
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
                                            let disabled = !!formData[item.id] || formData[item.id] === '';
                                            return <MenuItem onClick={() => addField(item.id)} key={key} disabled={disabled}>{item.text}</MenuItem>
                                        })
                                    }
                                </Menu>
                            </div>
                            <div className='contactDetailsEditForm'>
                                {
                                    Object.keys(formData).map((key) => {
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
                                                        onChange={handleFormChange}
                                                        value={formData[key] || ''}
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
                                    })}
                            </div>

                        </section>
                        <Button className='saveBtn' onClick={publishJob}>
                            Publish job
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default NewJob;