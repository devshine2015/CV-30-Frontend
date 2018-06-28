import React from 'react';
import { Grid, Icon, IconButton, Button, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, FormControl, InputLabel, Input } from '@material-ui/core';
// import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import ExperienceEdit from './experienceEdit';
import ExperienceDisplay from './experienceDisplay';
import EditContactDetails from './editContactDetails';
import { compose } from 'react-apollo';
import { pure, withState, withHandlers } from 'recompose';
import fields from '../../../../constants/contact';

const ShowHOC = compose(
    withState('newXP', 'setNewXP', false),
    withState('newProj', 'setNewProj', false),
    withState('story', 'setMyStory', ({ currentUser }) => currentUser.profile.story || ''),
    withState('editContactDetails', 'setEditContactDetails', false),
    withState('contactExpanded', 'setContactExpanded', false),
    withState('isSalaryPublic', 'setSalaryPrivacy', ({ currentUser }) => currentUser.profile.salary ? currentUser.profile.salary.isPublic : false),
    withState('desiredSalary', 'setDesiredSalary', ({ currentUser }) => currentUser.profile.salary ? currentUser.profile.salary.amount : 0),
    withHandlers({
        addNewExperience: ({ newXP, setNewXP }) => () => {
            setNewXP(!newXP);
        },
        addNewProject: ({ newProj, setNewProj }) => () => {
            setNewProj(!newProj);
        },
        toggleEditContact: ({ editContactDetails, setEditContactDetails, setContactExpanded }) => () => {
            setEditContactDetails(!editContactDetails);
            if (!editContactDetails)
                setContactExpanded(true);
        },
        closeContactEdit: ({ setEditContactDetails }) => () => {
            setEditContactDetails(false);
        },
        toggleContactExpanded: ({ contactExpanded, setContactExpanded }) => () => {
            setContactExpanded(!contactExpanded)
        },
        toggleSalaryPrivate: ({ isSalaryPublic, setSalaryPrivacy }) => () => {
            setSalaryPrivacy(!isSalaryPublic);
        },
        updateStory: ({ setMyStory }) => text => {
            setMyStory(text);
        },
        updateDesiredSalary: ({ setDesiredSalary }) => salary => {
            setDesiredSalary(salary);
        }
    }),
    pure
);

const Show = (props) => {
    const { editMode, currentUser,
        newXP, newProj, addNewExperience, addNewProject,
        editContactDetails, toggleEditContact, closeContactEdit, toggleContactExpanded, contactExpanded,
        toggleSalaryPrivate,
        story, updateStory,
        updateDesiredSalary, isSalaryPublic, desiredSalary
    } = props;

    const { contact, experience, projects, } = currentUser.profile;

    return (
        <Grid container className='mainBody userProfileShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                {
                    ((experience && experience.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <h2 className='sectionTitle'>My <b>experience</b></h2>
                        {
                            experience.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'experience'} />)
                            //key={`xpItem-${index}`}
                        }
                        {editMode && !newXP &&
                            <div className='experienceAdd'>
                                <Button className='addXPButton' onClick={addNewExperience}>
                                    + Add Experience
                        </Button>
                            </div>
                        }
                        {
                            (editMode && newXP) && <ExperienceEdit type={'experience'} />
                        }

                    </section>
                }
                {
                    ((projects && projects.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <h2 className='sectionTitle'>My <b>projects</b></h2>
                        {
                            projects.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'project'} />)
                            //key={`projectItem-${index}`}
                        }
                        {editMode && !newProj &&
                            <div className='experienceAdd'>
                                <Button className='addXPButton' onClick={addNewProject}>
                                    + Add project
                        </Button>
                            </div>
                        }
                        {
                            (editMode && newProj) && <ExperienceEdit type={'project'} />
                        }

                    </section>
                }
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <div className='columnTitle'>
                        <h2 className="columnTitle">
                            Contact&nbsp;<b>me</b>
                            <IconButton onClick={toggleContactExpanded} className='contactExpandToggle'>
                                {
                                    contactExpanded ?
                                        <i className="fas fa-angle-up"></i> :
                                        <i className="fas fa-angle-down"></i>
                                }
                            </IconButton>
                            {
                                editMode &&
                                <IconButton className='contactEditBtn' onClick={toggleEditContact}>
                                    <Icon>edit</Icon>
                                </IconButton>
                            }
                        </h2>
                        {
                            !editContactDetails &&
                            <div className={contactExpanded ? 'contactDetails open' : 'contactDetails'}>
                                {contact && Object.keys(contact).map((key) => {
                                    const result = fields.find(field => field.id === key);
                                    if (result) {
                                        let label = result.text;
                                        let value = contact[key];
                                        if (value && value !== '') {
                                            return (
                                                <p className='contactDetail' key={label}>
                                                    <span>{label}: </span><b>{value}</b>
                                                </p>
                                            )
                                        }
                                    }
                                })}
                            </div>
                        }
                        {editContactDetails && <EditContactDetails contact={contact} closeContactEdit={closeContactEdit} open={contactExpanded} />}

                    </div>
                    <div className='knowHowContainer'>
                        <div className='controls'>
                            <h4>Know<b>how</b></h4>
                            <div className='sliderControls'>
                                <IconButton className='sliderArrow'>
                                    <Icon>
                                        arrow_back_ios
                                </Icon>
                                </IconButton>

                                <span className='sliderDot'></span>
                                <span className='sliderDot'></span>
                                <span className='sliderDot active'></span>
                                <span className='sliderDot'></span>
                                <span className='sliderDot'></span>

                                <IconButton className='sliderArrow'>
                                    <Icon>
                                        arrow_forward_ios
                                </Icon>
                                </IconButton>
                            </div>
                        </div>

                        <div className='sliderContainer'>
                            <p>
                                Lorem ipsum dolor sit amet, cu mei reque inimicus. Exerci altera usu te. Omnis primis id vel, ei primis torquatos eum, per ex munere dolore
                                malorum. Recusabo prodesset no ius. Ad unum convenire elaboraret ius, te quem graeco sea.
                        </p>
                            <div className='media'>
                                <Icon className='playIcon'>
                                    play_circle_filled
                            </Icon>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='myStoryContainer'>
                        <h4>My&nbsp;<b>story</b></h4>
                        {
                            editMode &&
                            <p className='storyHelperText'>Write a few words about yourself.</p>
                        }
                        {editMode ?
                            <TextField
                                className='storyEditor'
                                InputProps={{
                                    classes: {
                                        root: 'bootstrapRoot',
                                        input: 'storyEditorinput',
                                    }
                                }}
                                value={story}
                                multiline
                                onChange={event => updateStory(event.target.value)}
                            /> :
                            <p>
                                {story}
                            </p>
                        }
                    </div>
                    {
                        editMode &&
                        <div className='desiredSalaryContainer'>
                            <h4>Desired&nbsp;<b>salary</b></h4>
                            <p>Chiar daca e privat, va ajuta la matching de joburi.</p>
                            <FormGroup row className='salaryToggle'>
                                <FormLabel className={!isSalaryPublic ? 'active' : ''}>Private</FormLabel>
                                <ToggleSwitch checked={isSalaryPublic} onChange={toggleSalaryPrivate}
                                    classes={{
                                        switchBase: 'colorSwitchBase',
                                        checked: 'colorChecked',
                                        bar: 'colorBar',
                                    }}
                                    color="primary" />
                                <FormLabel className={isSalaryPublic ? 'active' : ''}>Public</FormLabel>
                            </FormGroup>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="desiredSalary">Amount</InputLabel>
                                <Input
                                    id="desiredSalary"
                                    name='desiredSalary'
                                    placeholder='Adauga suma...'
                                    type='number'
                                    value={desiredSalary}
                                    onChange={event => updateDesiredSalary(event.target.value)}
                                // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                />
                            </FormControl>
                        </div>
                    }
                </div>
            </Grid>
        </Grid>
    );
};

export default ShowHOC(Show);