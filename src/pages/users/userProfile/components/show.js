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
import { s3BucketURL } from '../../../../constants/s3'

const ShowHOC = compose(
    pure,
    withRouter,
    graphql(setStory, { name: 'setStory' }),
    graphql(setCVFile, { name: 'setCVFile' }),
    graphql(setSalary, { name: 'setSalary' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ profileQuery: { profile } }) => ({
        cvUrl: null,
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
        handleSuccess: ({setCVFile, match, client, setFeedbackMessage, state, setState, currentUser: { auth: { currentUser } }}) => async ({filename}) => {
            const { id: userId } = currentUser
            setState({
                ...state,
                cvUrl: s3BucketURL + '/profile/' + userId + '/' + filename
            })
            try {
                await setCVFile({
                    variables: {
                        cvFile: 'profile/' + userId + "/" + filename
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
    })
);

class PortfolioExperienceWrapper extends React.PureComponent {
    state = {
        add: false
    };
    toggle = () => this.setState({ add: !this.state.add })
    render() {
        return (
            <section className='experienceSection'>
                <FormattedMessage id="users.myExperience" defaultMessage="My \nexperience" description="My experience">
                    {(text) => (
                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                    )}
                </FormattedMessage>
                {
                    this.props.experience.map((job, index) => <ExperienceDisplay userId={this.props.userId} job={job} globalEditMode={this.props.editMode} type={'experience'} key={`xpItem-${index}`} />)
                }
                {
                    this.props.editMode && !this.state.add &&
                    <FormattedMessage id="users.addExperience" defaultMessage="+ Add Experience" description="Add Experience">
                        {(text) => (
                            <div className='experienceAdd' onClick={this.toggle}>
                                { text }
                            </div>
                        )}
                    </FormattedMessage>
                }
                {
                    this.props.editMode && this.state.add && <ExperienceEdit userId={this.props.userId} type={'experience'} closeEditor={this.toggle} />
                }
            </section>
        );
    }
}

const Show = props => {
    const {
        state: {
            newProj,
            newHobby,
            imageUploadOpen,
            newEduc,
            isPopUpOpen,
            story,
            contactExpanded,
            isSalaryPublic,
            desiredSalary,
            cvUrl
        },
        getEditMode, isEditAllowed,
        profileQuery: { profile },
        addNewProject, closeNewProject, addNewEducation, addNewHobby,
        toggleEditContact, closeContactEdit, toggleContactExpanded, closeNewEducation, closeNewHobby,
        openArticlePopUp, closeArticlePopUp,
        toggleSalaryPrivate, handleError, handleSuccess,
        updateStory, saveStory,openImageUpload,closeImageUpload, // Add Image Upload
        updateDesiredSalary, saveDesiredSalary,
        currentUser: { auth: { currentUser } }
    } = props;

    let editMode = false;
    try {
        editMode = isEditAllowed && getEditMode.editMode.status;
    } catch(error) {}

    const { contact, experience, projects, aboutMeArticles, salary, educations, hobbies } = profile;
    const { id: userId } = currentUser || {};
    console.log("*****************", userId)
    return (
        <Grid container className='mainBody userProfileShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                {
                    ((experience && experience.length > 0) || editMode) && <PortfolioExperienceWrapper editMode={editMode} experience={experience} userId={userId} />
                }
                {
                    ((projects && projects.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <FormattedMessage id="users.myProjects" defaultMessage="My \nprojects" description="My projects">
                            {(text) => (
                                <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                            )}
                        </FormattedMessage>
                        
                        {
                            projects.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'project'} key={`projectItem-${index}`} />)
                        }
                        {editMode && !newProj &&
                            <FormattedMessage id="users.addProejcts" defaultMessage="+ Add project" description="Add project">
                                    {(text) => (
                                        <div className='experienceAdd' onClick={addNewProject}>
                                            {text}
                                        </div>
                                    )}
                            </FormattedMessage>
                            
                        }
                        {
                            (editMode && newProj) && <ExperienceEdit userId={userId} type={'project'} closeEditor={closeNewProject} />
                        }

                    </section>
                }
                {
                    ((educations && educations.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <FormattedMessage id="users.myEducation" defaultMessage="My \neducation" description="My education">
                            {(text) => (
                                <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                            )}
                        </FormattedMessage>
                        
                        {
                            educations.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'education'} key={`educationItem-${index}`} />)
                        }
                        {editMode && !newEduc &&
                            <FormattedMessage id="users.addEducation" defaultMessage="+ Add education" description="Add education">
                                {(text) => (
                                    <div className='experienceAdd' onClick={addNewEducation}>
                                        {text}
                                    </div>
                                )}
                            </FormattedMessage>
                            
                        }
                        {
                            (editMode && newEduc) && <ExperienceEdit userId={userId} type={'education'} closeEditor={closeNewEducation} />
                        }

                    </section>
                }
                {
                    ((hobbies && hobbies.length > 0) || editMode) &&

                    <section className='experienceSection'>
                        <FormattedMessage id="users.myHobbies" defaultMessage="My \nhobbies" description="My hobbies">
                            {(text) => (
                                <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                            )}
                        </FormattedMessage>
                        
                        {
                            hobbies.map((job, index) => <ExperienceDisplay job={job} globalEditMode={editMode} type={'hobby'} key={`hobbyItem-${index}`} />)
                        }
                        {editMode && !newHobby &&
                            <FormattedMessage id="users.addHobby" defaultMessage="+ Add hobby" description="Add hobby">
                                    {(text) => (
                                            <div className='experienceAdd' onClick={addNewHobby}>
                                                {text}
                                            </div>
                                    )}
                            </FormattedMessage>
                            
                        }
                        {
                            (editMode && newHobby) && <ExperienceEdit userId={userId} type={'hobby'} closeEditor={closeNewHobby} />
                        }

                    </section>
                }
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <div className='columnTitle'>
                        <FormattedMessage id="users.contactMe" defaultMessage="Contact\nme" description="Contact Me">
                            {(text) => (
                                <h2 className="columnTitle">
                                    {text.split("\n")[0]}&nbsp;<b>{text.split("\n")[1]}</b>
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
                            )}
                        </FormattedMessage>
                        
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
                            <FormattedMessage id="users.knowHow" defaultMessage="Know\nhow" description="Know How">
                                {(text) => (
                                    <ArticleSlider
                                        articles={aboutMeArticles}
                                        title={(<h4>{text.split("\n")[0]}<b>{text.split("\n")[1]}</b></h4>)}
                                    />
                                )}
                            </FormattedMessage>
                            
                        </div>
                    }
                    {editMode &&
                        <React.Fragment>
                            <FormattedMessage id="company.team.addArticle" defaultMessage="+ Add Article" description="Add Article">
                                {(text) => (
                                    <div className='addArticle' onClick={openArticlePopUp}>
                                        {text}
                                    </div>
                                )}
                            </FormattedMessage>
                            
                            <ArticlePopUp
                                type='profile_isAboutMe'
                                open={isPopUpOpen}
                                onClose={closeArticlePopUp}
                            />
                        </React.Fragment>
                    }
                    {editMode &&
                        <React.Fragment>
                            <FormattedMessage id="users.uploadDocument" defaultMessage="+ Upload document" description="Upload document">
                                {(text) => (
                                    <div className='addArticle' onClick={openImageUpload}>
                                        {text}
                                    </div>
                                )}
                            </FormattedMessage>
                            {
                                cvUrl &&
                                <a href={cvUrl} download="cvfile">
                                    download cvfile
                                </a>
                            }
                            <ImageUploader
                                type='cv'
                                open={imageUploadOpen}
                                onClose={closeImageUpload}
                                onError={handleError}
                                onSuccess={handleSuccess}
                                // id={articleId}
                                userId={userId} 
                            />
                        </React.Fragment>
                        
                    }
                    {(aboutMeArticles && aboutMeArticles.length > 0) &&
                        <hr />
                    }
                    <div className='myStoryContainer'>
                        <FormattedMessage id="users.myStory" defaultMessage="My\nstory" description="My Story">
                            {(text) => (
                                <h4>{text.split("\n")[0]}&nbsp;<b>{text.split("\n")[1]}</b></h4>
                            )}
                        </FormattedMessage>
                        
                        {
                            editMode &&
                            <FormattedMessage id="users.writeYourself" defaultMessage="Write a few words about yourself." description="Write a few words about yourself">
                                {(text) => (
                                    <p className='storyHelperText'>{text}</p>
                                )}
                            </FormattedMessage>
                            
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
                            <FormattedMessage id="users.desiredSalary" defaultMessage="Desired\nsalary" description="Desired Salary">
                                {(text) => (
                                    <h4>{text.split("\n")[0]}&nbsp;<b>{text.split("\n")[1]}</b></h4>
                                )}  
                            </FormattedMessage>
                            
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
                                        <FormattedMessage id="users.salaryAmount" defaultMessage="Amount" description="Amount">
                                            {(text) => (
                                                <InputLabel htmlFor="desiredSalary">{text}</InputLabel>
                                            )}
                                        </FormattedMessage>
                                        <FormattedMessage id="users.addAmount" defaultMessage="Add amount..." description="Add amount">
                                            {(text) => (
                                                <Input
                                                    id="desiredSalary"
                                                    name='desiredSalary'
                                                    placeholder={text}
                                                    type='number'
                                                    value={desiredSalary}
                                                    onChange={event => updateDesiredSalary(event.target.value)}
                                                />
                                            )}
                                        </FormattedMessage>
                                        
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