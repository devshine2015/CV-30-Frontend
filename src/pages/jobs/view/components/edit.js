import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { TextField, Grid, Button, Select, MenuItem, FormControl, Input, Checkbox, ListItemText, IconButton, Icon, Menu, FormControlLabel } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';

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
import BenefitsList from '../../../../constants/benefits';
import { teamsQuery, handleJob, setFeedbackMessage, jobTypesQuery, getJobQuery } from '../../../../store/queries';
import Loader from '../../../../components/Loader';
import TagsInput from '../../../../components/TagsInput';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const EditHOC = compose(
    graphql(teamsQuery, {
        name: 'teamsQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(jobTypesQuery, {
        name: 'jobTypesQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        })
    }),
    withState('formData', 'setFormData', props => {
        const { getJobQuery: { job: { id, team, i18n, expireDate, company, activityField, skills, jobTypes, salary } } } = props;

        let jobEdit = {
            id,
            expireDate,
            teamId: team.id,
            companyId: company.id,
            title: (i18n && i18n[0]) ? i18n[0].title : '',
            description: (i18n && i18n[0]) ? i18n[0].description : '',
            idealCandidate: (i18n && i18n[0]) ? i18n[0].idealCandidate : '',
            benefits: [],
            activityField: activityField ? activityField.i18n[0].title : '',
            skills: skills.map(skill => skill.i18n[0].title),
            selectedJobTypes: jobTypes.map(jt => jt.id),
            salary: {
                amountMin: salary ? salary.amountMin : 0,
                amountMax: salary ? salary.amountMax : 1000,
                currency: salary ? salary.currency : 'eur'
            },
            salaryRangeStart: 0,
            salaryRangeEnd: 5000,
            salaryPublic: salary ? salary.isPublic : false
        };

        return jobEdit;
    }),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('anchorEl', 'setAnchorEl', null),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        getSignedUrl: ({ setFeedbackMessage }) => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['job', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type
            };

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error || error.message
                    }
                });
            }
        },
        onUploadStart: ({ setIsUploading }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setIsUploading(true);
                next(file);
            }
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        onFinishUpload: ({ setIsUploading }) => async () => {
            setIsUploading(false);
            await setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'File uploaded successfully.'
                }
            });
        },
        updateDescription: props => text => props.setFormData(state => ({ ...state, 'description': text })),
        updateIdealCandidate: props => text => props.setFormData(state => ({ ...state, 'idealCandidate': text })),

        publishJob: ({ handleJob, formData, match, setFeedbackMessage }) => async () => {
            const { id, companyId, teamId, title, description, expireDate, idealCandidate, selectedJobTypes: jobTypes, salary, salaryPublic, skills, activityField } = formData;
            try {
                await handleJob({
                    variables: {
                        language: match.params.lang,
                        jobDetails: {
                            id,
                            companyId,
                            teamId,
                            title, 
                            description,
                            expireDate,
                            idealCandidate,
                            jobTypes,
                            salary: {
                                ...salary,
                                isPublic: salaryPublic
                            },
                            skills,
                            activityField
                        }
                    },
                    refetchQueries: [{
                        query: getJobQuery,
                        fetchPolicy: 'network-only',
                        name: 'getJobQuery',
                        variables: {
                            id: match.params.jobId,
                            language: match.params.lang
                        },
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },

        handleClick: ({ setAnchorEl }) => event => {
            setAnchorEl(event.currentTarget);
        },

        handleClose: ({ setAnchorEl }) => () => {
            setAnchorEl(null);
        },
        addField: ({ setAnchorEl, formData, setFormData }) => (fieldId) => {
            let contact = Object.assign({}, formData);
            if (!contact[fieldId]) {
                contact[fieldId] = '';
                setFormData(contact);
            }
            setAnchorEl(null);
        },
        removeTextField: ({ formData, setFormData }) => async (key) => {
            let contact = Object.assign({}, formData);
            await delete contact[key];
            setFormData(contact);
        },
        handleSliderChange: ({ setFormData, formData }) => value => {
            setFormData({ 
                ...formData, 
                salary: {
                    ...formData.salary,
                    amountMin: value[0],
                    amountMax: value[1]
                }
            });
        },
        onSkillsChange: ({ setFormData, formData }) => skills => {
            setFormData({ ...formData, skills });
        }
    }),
    pure
);
const Edit = props => {
    const {
        teamsQuery, jobTypesQuery,
    } = props;

    if (teamsQuery.loading || jobTypesQuery.loading)
        return <Loader />

    const {
        formData: { title, expireDate, benefits, teamId, description, idealCandidate, activityField, selectedJobTypes, skills, salary, salaryPublic, salaryRangeStart, salaryRangeEnd }, handleFormChange,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading,
        updateDescription, updateIdealCandidate,
        anchorEl, handleClick, handleClose, addField, formData, removeTextField,
        publishJob, onSkillsChange, handleSliderChange,
        feedbackMessage, closeFeedback
    } = props;

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
                        onChange={handleFormChange}
                        value={title}
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
                            <TagsInput value={skills} onChange={onSkillsChange} helpTagName='skill' className='textField jobSelect' />
                        </section>
                        <section className='jobType'>
                            <h2 className='sectionTitle'>Job <b>type</b></h2>
                            <p className='helperText'>
                                Select job type(s).
                            </p>
                            <FormControl className='formControl'>
                                <Select
                                    multiple
                                    value={selectedJobTypes}
                                    onChange={handleFormChange}
                                    input={<Input name="selectedJobTypes" />}
                                    renderValue={selected => selected.map(item => jobTypesQuery.jobTypes.find(jt => jt.id === item).i18n[0].title).join(', ')}
                                    className='jobSelect'
                                >
                                    {jobTypesQuery.jobTypes.map(jobType => (
                                        <MenuItem key={jobType.id} value={jobType.id}>
                                            <Checkbox checked={selectedJobTypes.indexOf(jobType.id) > -1} />
                                            <ListItemText primary={jobType.i18n[0].title} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </section>
                        <section className='salary'>
                            <h2 className='sectionTitle'>Salary <b>range</b></h2>
                            <Range min={salaryRangeStart} max={salaryRangeEnd} defaultValue={[salary.amountMin, salary.amountMax]} tipFormatter={value => `${value}${formatCurrency(salary.currency)}`} step={50} onChange={handleSliderChange} />
                            <FormControlLabel
                                control={
                                    <Checkbox name="salaryPublic" checked={salaryPublic} onChange={handleFormChange} />
                                }
                                label="Public" />
                        </section>
                    </form>
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
        </React.Fragment>
    );
}

export default EditHOC(Edit);
