import React from 'react';
import { Grid, Icon, IconButton, Button, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, FormControl, InputLabel, Input } from '@material-ui/core';
// import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { setStory, setSalary, currentUserQuery } from '../../../../store/queries';
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { s3BucketURL } from '../../../../constants/s3';

import ExperienceEdit from './experienceEdit';
import ExperienceDisplay from './experienceDisplay';
import EditContactDetails from './editContactDetails';
import { compose, graphql } from 'react-apollo';
import { pure, withState, withHandlers } from 'recompose';
import fields from '../../../../constants/contact';
import ArticlePopUp from '../../../../components/ArticlePopup';
import Slider from '../../../../hocs/slider';

const ShowHOC = compose(
    withRouter,
    graphql(setStory, { name: 'setStory' }),
    graphql(setSalary, { name: 'setSalary' }),
    withState('newXP', 'setNewXP', false),
    withState('newProj', 'setNewProj', false),
    withState('isPopUpOpen', 'setIsPopUpOpen', false),
    withState('count', 'setCount', ({ currentUser }) => currentUser.profile.aboutMeArticles ? currentUser.profile.aboutMeArticles.length - 1 : 0),
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
        saveStory: ({ setStory, story, match }) => async () => {
            try {
                await setStory({
                    variables: {
                        story: {
                            title: 'My story',
                            description: story
                        },
                        language: match.params.lang
                    },
                    refetchQueries: [{
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: match.params.lang
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
        saveDesiredSalary: ({ setSalary, isSalaryPublic, desiredSalary, match }) => async () => {
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
                            language: match.params.lang,
                            id: match.params.profileId
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err);
            }
        },
        openArticlePopUp: ({ setIsPopUpOpen }) => () => {
            setIsPopUpOpen(true);
        },
        closeArticlePopUp: ({ setIsPopUpOpen }) => () => {
            setIsPopUpOpen(false);
        }

    }),
    Slider,
    pure
);

const Show = (props) => {
    const { editMode, currentUser,
        newXP, newProj, addNewExperience, closeNewExperience, addNewProject, closeNewProject,
        editContactDetails, toggleEditContact, closeContactEdit, toggleContactExpanded, contactExpanded,
        openArticlePopUp, isPopUpOpen, closeArticlePopUp,
        toggleSalaryPrivate,
        story, updateStory, saveStory,
        updateDesiredSalary, isSalaryPublic, desiredSalary, saveDesiredSalary,
        activeItem, prevItem, nextItem, jumpToItem
    } = props;

    const { contact, experience, projects, aboutMeArticles, salary } = currentUser.profile;

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
                                        }
                                    }
                                })}
                            </div>
                        }
                        {editContactDetails && <EditContactDetails contact={contact} closeContactEdit={closeContactEdit} open={contactExpanded} />}

                    </div>
                    {(aboutMeArticles && aboutMeArticles.length > 0) &&
                        <div className='knowHowContainer'>
                            <div className='controls'>
                                <h4>Know<b>how</b></h4>
                                {(aboutMeArticles.length > 1) &&
                                    <div className='sliderControls'>
                                        <IconButton className='sliderArrow' onClick={prevItem}>
                                            <Icon>
                                                arrow_back_ios
                                        </Icon>
                                        </IconButton>
                                        {
                                            aboutMeArticles && aboutMeArticles.map((item, index) =>
                                                (<span className={index === activeItem ? 'sliderDot active' : 'sliderDot'} key={`storyMarker - ${index}`} onClick={() => jumpToItem(index)} />)
                                            )
                                        }

                                        <IconButton className='sliderArrow' onClick={nextItem}>
                                            <Icon>
                                                arrow_forward_ios
                                        </Icon>
                                        </IconButton>
                                    </div>
                                }
                            </div>

                            {
                                aboutMeArticles.map((article, index) => {
                                    let image, video;
                                    if (article.images && article.images.length > 0) {
                                        image = `${s3BucketURL}${article.images[0].path}`;
                                    }
                                    if (article.videos && article.videos.length > 0) {
                                        video = article.videos[0].path;
                                    }
                                    return (
                                        <div className={index === activeItem ? 'sliderContainer active' : 'sliderContainer'}>
                                            <p>{article.i18n ? article.i18n[0].description : ''}</p>
                                            <div className='media'>
                                                {image &&
                                                    <img src={image} alt={story.id} className='storyImg' />
                                                }
                                                {(video && !image) &&
                                                    <ReactPlayer
                                                        url={video}
                                                        width='100%'
                                                        height='100%'
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
                                                }
                                            </div>
                                        </div>
                                    );
                                })
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
                        </div>
                    }
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
                            <p className='storyText'>
                                {story}
                            </p>
                        }
                    </div>
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
                                    />
                                </FormControl>
                                <IconButton className='submitBtn' onClick={saveDesiredSalary}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default ShowHOC(Show);