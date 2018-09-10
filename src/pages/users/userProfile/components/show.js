import React from 'react';
import { Grid, Icon, IconButton, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, FormControl, InputLabel, Input } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { setStory, setSalary, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import { withRouter } from 'react-router-dom';


import ExperienceEdit from './experienceEdit';
import ExperienceDisplay from './experienceDisplay';
import EditContactDetails from './editContactDetails';
import { compose, graphql } from 'react-apollo';
import { pure, withState, withHandlers } from 'recompose';
import fields from '../../../../constants/contact';
import ArticlePopUp from '../../../../components/ArticlePopup';
import ArticleSlider from '../../../../components/articleSlider';
// import Feedback from '../../../../components/Feedback';

const ShowHOC = compose(
    withRouter,
    graphql(setStory, { name: 'setStory' }),
    graphql(setSalary, { name: 'setSalary' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ profileQuery: { profile } }) => ({
        newXP: false,
        newProj: false,
        isPopUpOpen: false,
        story: profile.story && profile.story.description,
        editContactDetails: false,
        contactExpanded: true,
        isSalaryPublic: profile.salary && profile.salary.isPublic,
        desiredSalary: (profile.salary && profile.salary.amount) || 0
    })),
    withHandlers({
        addNewExperience: ({ state, setState }) => () => setState({ ...state, newXP: !state.newXP }),
        closeNewExperience: ({ state, setState }) => () => setState({ ...state, newXP: false }),
        addNewProject: ({ state, setState }) => () => setState({ ...state, newProj: !state.newProj }),
        closeNewProject: ({ state, setState }) => () => setState({ ...state, newProj: false }),
        toggleEditContact: ({ state, setState }) => () => setState({ ...state, editContactDetails: !state.editContactDetails, contactExpanded: state.editContactDetails === false }),
        closeContactEdit: ({ state, setState }) => () => setState({ ...state, editContactDetails: false }),
        toggleContactExpanded: ({ state, setState }) => () => setState({ ...state, contactExpanded: !state.contactExpanded }),
        toggleSalaryPrivate: ({ state, setState }) => () => setState({ ...state, isSalaryPublic: !state.isSalaryPublic }),
        updateStory: ({ state, setState }) => story => setState({ ...state, story }),
        saveStory: ({ setStory, state: { story }, match, setFeedbackMessage }) => async () => {
            try {
                await setStory({
                    variables: {
                        story: {
                            title: 'My story',
                            description: story
                        },
                        language: match.params.lang
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
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
        updateDesiredSalary: ({ state, setState }) => desiredSalary => setState({ ...state, desiredSalary }),
        saveDesiredSalary: ({ setSalary, state: { isSalaryPublic, desiredSalary }, match, setFeedbackMessage }) => async () => {
            try {
                await setSalary({
                    variables: {
                        salary: {
                            amount: desiredSalary,
                            isPublic: isSalaryPublic,
                            currency: 'ron'
                        }
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
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
        openArticlePopUp: ({ state, setState }) => () => setState({ ...state, isPopUpOpen: true }),
        closeArticlePopUp: ({ state, setState }) => () => setState({ ...state, isPopUpOpen: false }),
    }),
    pure
);

const Show = props => {
    const {
        state: {
            newXP,
            newProj,
            isPopUpOpen,
            story,
            editContactDetails,
            contactExpanded,
            isSalaryPublic,
            desiredSalary
        },
        getEditMode, isEditAllowed,
        profileQuery: { profile },
        addNewExperience, closeNewExperience, addNewProject, closeNewProject,
        toggleEditContact, closeContactEdit, toggleContactExpanded,
        openArticlePopUp, closeArticlePopUp,
        toggleSalaryPrivate,
        updateStory, saveStory,
        updateDesiredSalary, saveDesiredSalary
    } = props;

    let editMode = false;
    try {
        editMode = isEditAllowed && getEditMode.editMode.status;
    } catch(error) {}

    const { contact, experience, projects, aboutMeArticles, salary } = profile;

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
                                + Add Experience
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
                                + Add project
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
                                        } else
                                            return null;
                                    }
                                    else
                                        return null;
                                })}
                            </div>
                        }
                        {editContactDetails && <EditContactDetails contact={contact} closeContactEdit={closeContactEdit} open={contactExpanded} />}

                    </div>
                    {(aboutMeArticles && aboutMeArticles.length > 0) &&
                        <div className='knowHowContainer'>
                            <ArticleSlider
                                articles={aboutMeArticles}
                                title={(<h4>Know<b>how</b></h4>)}
                            />
                        </div>
                    }
                    {editMode &&
                        <React.Fragment>
                            <div className='addArticle' onClick={openArticlePopUp}>
                                + Add Article
                            </div>
                            <ArticlePopUp
                                type='profile_isAboutMe'
                                open={isPopUpOpen}
                                onClose={closeArticlePopUp}
                            />
                        </React.Fragment>
                    }
                    {(aboutMeArticles && aboutMeArticles.length > 0) &&
                        <hr />
                    }
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
                            <p className='storyText'>
                                {story}
                            </p>
                        }
                    </div>
                    {(editMode || (!editMode && isSalaryPublic)) &&
                        <div className='desiredSalaryContainer'>
                            <h4>Desired&nbsp;<b>salary</b></h4>
                            {
                                (!editMode && isSalaryPublic) &&
                                <p className='salaryDisplay'>
                                    {salary.amount}&nbsp;
                                <span className='currency'>{salary.currency}</span>
                                </p>
                            }
                            {
                                editMode &&
                                <React.Fragment>
                                    <FormattedMessage id="userProfile.desiredSalaryMessage" defaultMessage="Even when set to private, it can help with job matching.">
                                        {text => <p>{text}</p>}
                                    </FormattedMessage>
                                    <FormGroup row className='salaryToggle'>
                                        <FormattedMessage id="userProfile.salaryPrivate" defaultMessage="Private">
                                            {text => <FormLabel className={!isSalaryPublic ? 'active' : ''}>{text}</FormLabel>}
                                        </FormattedMessage>
                                        <ToggleSwitch checked={isSalaryPublic} onChange={toggleSalaryPrivate}
                                            classes={{
                                                switchBase: 'colorSwitchBase',
                                                checked: 'colorChecked',
                                                bar: 'colorBar',
                                            }}
                                            color="primary" />
                                        <FormattedMessage id="userProfile.salaryPublic" defaultMessage="Public">
                                            {text => <FormLabel className={isSalaryPublic ? 'active' : ''}>{text}</FormLabel>}
                                        </FormattedMessage>
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
                                        />
                                    </FormControl>
                                    <IconButton className='submitBtn' onClick={saveDesiredSalary}>
                                        <Icon>done</Icon>
                                    </IconButton>
                                </React.Fragment>
                            }
                        </div>
                    }
                </div>
            </Grid>
        </Grid>
    );
};

export default ShowHOC(Show);