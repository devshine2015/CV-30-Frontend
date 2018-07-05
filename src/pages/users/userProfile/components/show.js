import React from 'react';
import { Grid, Icon, IconButton, Button, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, FormControl, InputLabel, Input } from '@material-ui/core';
// import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { setStory, setSalary, currentUserQuery } from '../../../../store/queries';

import ExperienceEdit from './experienceEdit';
import ExperienceDisplay from './experienceDisplay';
import EditContactDetails from './editContactDetails';
import { compose, graphql } from 'react-apollo';
import { pure, withState, withHandlers } from 'recompose';
import fields from '../../../../constants/contact';
import AddStoryInline from '../../../../components/ArticleInline';

const ShowHOC = compose(
    graphql(setStory, { name: 'setStory' }),
    graphql(setSalary, { name: 'setSalary' }),
    withState('newXP', 'setNewXP', false),
    withState('newProj', 'setNewProj', false),
    withState('story', 'setMyStory', ({ currentUser }) => currentUser.profile.story && currentUser.profile.story.i18n && currentUser.profile.story.i18n[0].description || ''),
    withState('editContactDetails', 'setEditContactDetails', false),
    withState('contactExpanded', 'setContactExpanded', true),
    withState('isSalaryPublic', 'setSalaryPrivacy', ({ currentUser }) => currentUser.profile.salary ? currentUser.profile.salary.isPublic : false),
    withState('desiredSalary', 'setDesiredSalary', ({ currentUser }) => currentUser.profile.salary ? currentUser.profile.salary.amount : 0),
    withHandlers({
        addNewExperience: ({ newXP, setNewXP }) => () => {
            setNewXP(!newXP);
        },
        closeNewExperience: ({ setNewXP }) => () => setNewXP(false),
        addNewProject: ({ newProj, setNewProj }) => () => {
            setNewProj(!newProj);
        },
        closeNewProject: ({ setNewProj }) => () => setNewProj(false),
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
        saveStory: ({ setStory, story }) => async () => {
            try {
                await setStory({
                    variables: {
                        story: {
                            title: 'My story',
                            description: story
                        },
                        language: 'en'
                    },
                    refetchQueries: [{
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en'
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        },
        updateDesiredSalary: ({ setDesiredSalary }) => salary => {
            setDesiredSalary(salary);
        },
        saveDesiredSalary: ({ setSalary, isSalaryPublic, desiredSalary }) => async () => {
            try {
                await setSalary({
                    variables: {
                        salary: {
                            amount: desiredSalary,
                            isPublic: isSalaryPublic,
                            currency: 'ron'
                        }
                    },
                    refetchQueries: [{
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en',
                            id: null
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        },
    }),
    pure
);

const Show = (props) => {
    const { editMode, currentUser,
        newXP, newProj, addNewExperience, closeNewExperience, addNewProject, closeNewProject,
        editContactDetails, toggleEditContact, closeContactEdit, toggleContactExpanded, contactExpanded,
        toggleSalaryPrivate,
        story, updateStory, saveStory,
        updateDesiredSalary, isSalaryPublic, desiredSalary, saveDesiredSalary
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
                            experience.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'experience'} key={`xpItem-${index}`} />)

                        }
                        {editMode && !newXP &&
                            <div className='experienceAdd' onClick={addNewExperience}>
                                <Button className='addXPButton'>
                                    + Add Experience
                                </Button>
                            </div>
                        }
                        {
                            (editMode && newXP) && <ExperienceEdit type={'experience'} closeEditor={closeNewExperience} />
                        }

                    </section>
                }
                {
                    ((projects && projects.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <h2 className='sectionTitle'>My <b>projects</b></h2>
                        {
                            projects.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'project'} key={`projectItem-${index}`} />)
                        }
                        {editMode && !newProj &&
                            <div className='experienceAdd' onClick={addNewProject}>
                                <Button className='addXPButton'>
                                    + Add project
                                </Button>
                            </div>
                        }
                        {
                            (editMode && newProj) && <ExperienceEdit type={'project'} closeEditor={closeNewProject} />
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
                        {editMode && <AddStoryInline />}
                    </div>
                    <hr />
                    <div className='myStoryContainer'>
                        <h4>My&nbsp;<b>story</b></h4>
                        {
                            editMode &&
                            <p className='storyHelperText'>Write a few words about yourself.</p>
                        }
                        {editMode ?
                            <React.Fragment>
                                <TextField
                                    className='storyEditor'
                                    InputProps={{
                                        classes: {
                                            root: 'bootstrapRoot',
                                            input: 'storyEditorinput',
                                        }
                                    }}
                                    value={story || ''}
                                    multiline
                                    onChange={event => updateStory(event.target.value)}
                                />
                                <IconButton className='submitBtn' onClick={saveStory}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </React.Fragment> :
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
                            <FormControl>
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
                            <IconButton className='submitBtn' onClick={saveDesiredSalary}>
                                <Icon>done</Icon>
                            </IconButton>
                        </div>
                    }
                </div>
            </Grid>
        </Grid>
    );
};

export default ShowHOC(Show);