import React from 'react';
import { Grid, Icon, IconButton, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, FormControl, InputLabel, Input } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { setStory, setSalary, setFeedbackMessage, setCVFile } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import { withRouter } from 'react-router-dom';

import ImageUploader from '../../../../components/imageUploader';
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
    graphql(setCVFile, { name: 'setCVFile' }),
    graphql(setSalary, { name: 'setSalary' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ profileQuery: { profile } }) => ({
        imageUploadOpen: false,
        newXP: false,
        newProj: false,
        newEduc: false,
        newHobby: false,
        isPopUpOpen: false,
        story: profile.story && profile.story.description,
        contactExpanded: true,
        isSalaryPublic: profile.salary && profile.salary.isPublic,
        desiredSalary: (profile.salary && profile.salary.amount) || 0
    })),
    withHandlers({
        // Add Image upload
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: () => error => { console.log("an error occured") },
        handleSuccess: ({setCVFile, match, client, setFeedbackMessage}) => async ({filename}) => {
            console.log('document upload success')
            try {
                await setCVFile({
                    variables: {
                        cvFile: 'profile' + filename
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
        //
        addNewExperience: ({ state, setState }) => () => setState({ ...state, newXP: !state.newXP }),
        closeNewExperience: ({ state, setState }) => () => setState({ ...state, newXP: false }),
        addNewProject: ({ state, setState }) => () => setState({ ...state, newProj: !state.newProj }),
        addNewEducation: ({ state, setState }) => () => setState({ ...state, newEduc: !state.newEduc }),
        addNewHobby: ({ state, setState }) => () => setState({ ...state, newHobby: !state.newHobby }),
        closeNewProject: ({ state, setState }) => () => setState({ ...state, newProj: false }),
        closeNewEducation: ({ state, setState }) => () => setState({ ...state, newEduc: false }),
        closeNewHobby: ({ state, setState }) => () => setState({ ...state, newHobby: false }),
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
                            amount: desiredSalary ? parseFloat(desiredSalary) : 0,
                            isPublic: !!isSalaryPublic,
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
            newHobby,
            imageUploadOpen,
            newEduc,
            isPopUpOpen,
            story,
            contactExpanded,
            isSalaryPublic,
            desiredSalary
        },
        getEditMode, isEditAllowed,
        profileQuery: { profile },
        addNewExperience, closeNewExperience, addNewProject, closeNewProject, addNewEducation, addNewHobby,
        toggleEditContact, closeContactEdit, toggleContactExpanded, closeNewEducation, closeNewHobby,
        openArticlePopUp, closeArticlePopUp,
        toggleSalaryPrivate, handleError, handleSuccess,
        updateStory, saveStory,openImageUpload,closeImageUpload, // Add Image Upload
        updateDesiredSalary, saveDesiredSalary
    } = props;

    let editMode = false;
    try {
        editMode = isEditAllowed && getEditMode.editMode.status;
    } catch(error) {}

    const { contact, experience, projects, aboutMeArticles, salary, educations, hobbies } = profile;
    console.log("*****************", profile)
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
                {
                    ((educations && educations.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <h2 className='sectionTitle'>My <b>educations</b></h2>
                        {
                            educations.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'education'} key={`educationItem-${index}`} />)
                        }
                        {editMode && !newEduc &&
                            <div className='experienceAdd' onClick={addNewEducation}>
                                + Add education
                            </div>
                        }
                        {
                            (editMode && newEduc) && <ExperienceEdit type={'education'} closeEditor={closeNewEducation} />
                        }

                    </section>
                }
                {
                    ((hobbies && hobbies.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <h2 className='sectionTitle'>My <b>hobbies</b></h2>
                        {
                            hobbies.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'hobby'} key={`hobbyItem-${index}`} />)
                        }
                        {editMode && !newHobby &&
                            <div className='experienceAdd' onClick={addNewHobby}>
                                + Add hobby
                            </div>
                        }
                        {
                            (editMode && newHobby) && <ExperienceEdit type={'hobby'} closeEditor={closeNewHobby} />
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
                            !editMode &&
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
                        {editMode && <EditContactDetails contact={contact} closeContactEdit={closeContactEdit} open={contactExpanded} />}

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
                    {editMode &&
                        <React.Fragment>
                            <div className='addArticle' onClick={openImageUpload}>
                                + Upload document
                            </div>
                            <ImageUploader
                                type='document'
                                open={imageUploadOpen}
                                onClose={closeImageUpload}
                                onError={handleError}
                                onSuccess={handleSuccess}
                                // id={articleId}
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