import React from 'react';
import { Grid, Avatar, Button, Icon, Hidden, IconButton, Chip, CircularProgress } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from "recompose";
import { FormattedMessage } from 'react-intl';
import { NavLink, withRouter, Link } from 'react-router-dom';
import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';

import ColorPicker from './colorPicker';
import SkillsEditor from './skillsEditor';
import slider from '../../../../hocs/slider';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { updateAvatar, setCoverBackground, setHasBackgroundImage, currentUserQuery, updateAvatarTimestampMutation, localUserQuery } from '../../../../store/queries';

import AddStoryPopup from '../../../../components/AddStoryPopup';


const HeaderHOC = compose(
    withRouter,
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(setCoverBackground, { name: 'setCoverBackground' }),
    graphql(setHasBackgroundImage, { name: 'setHasBackgroundImage' }),
    withState('count', 'setCount', ({ currentUser }) => currentUser.profile.featuredArticles ? currentUser.profile.featuredArticles.length - 1 : 0),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('skillsAnchor', 'setSkillsAnchor', null),
    withState('skillsModalData', 'setSkillsModalData', null),
    // withState('avatar', 'setAvatar', ({ currentUser }) => currentUser.profile.hasAvatar ? `${s3BucketURL}/${profilesFolder}/avatar.jpg?${Date.now()}` : null),
    withState('isUploading', 'setIsUploading', false),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('storyEditorAnchor', 'setStoryEditorAnchor', null),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        openSkillsModal: ({ currentUser, setSkillsAnchor, setSkillsModalData }) => (type, target) => {
            const { skills, values } = currentUser.profile;
            if (type === 'values')
                setSkillsModalData({
                    type: type,
                    data: values
                })
                    ;
            if (type === 'skills')
                setSkillsModalData({
                    type: type,
                    data: skills
                });
            setSkillsAnchor(target);
        },
        closeSkillsModal: ({ setSkillsAnchor, setSkillsModalData }) => () => {
            setSkillsModalData(null);
            setSkillsAnchor(null);
        },
        removeStory: ({ profile, setHeaderStories }) => index => {
            let stories = [...profile.featuredArticles];
            stories.splice(index, 1);
            setHeaderStories(stories);
        },
        getSignedUrl: () => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');

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
                callback(error)
            }
        },
        renameFile: () => filename => {
            let getExtension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');
            return fName;
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
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: (props) => async () => {
            const { setIsUploading, updateAvatar, updateAvatarTimestamp } = props;
            await updateAvatar({
                variables: {
                    status: true
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
            await updateAvatarTimestamp({
                variables: {
                    timestamp: Date.now()
                }
            });

            setIsUploading(false);
        },
        refetchBgImage: ({ setForceCoverRender }) => () => setForceCoverRender(Date.now()),
        removeStory: ({ headerStories, setHeaderStories }) => (index) => {
            let stories = [...headerStories];
            stories.splice(index, 1);
            setHeaderStories(stories);
        },
        toggleStoryEditor: ({ setStoryEditorAnchor }) => target => {
            setStoryEditorAnchor(target);
        },
        closeStoryEditor: ({ setStoryEditorAnchor }) => () => {
            setStoryEditorAnchor(null);
        }
    }),
    slider,
    pure
);


const Header = (props) => {
    const { editMode, currentUser,
        closeColorPicker, toggleColorPicker, colorPickerAnchor,
        removeStory,
        activeItem, prevItem, jumpToItem, nextItem,
        openSkillsModal, skillsModalData, skillsAnchor, closeSkillsModal,
        getSignedUrl, renameFile, onProgress, onError, onFinishUpload, onUploadStart,
        isUploading, uploadProgress,
        localUserData, refetchBgImage, forceCoverRender,
        storyEditorAnchor, toggleStoryEditor, closeStoryEditor
    } = props;
    const {
        firstName,
        lastName,
        email,
        featuredArticles,
        // skills,
        // values,
        coverBackground, hasProfileCover
    } = currentUser.profile;

    const skills = currentUser.profile.skills ? currentUser.profile.skills.map(item => {
        return {
            id: item.id,
            title: item.i18n[0].title
        }
    }) : [];

    const values = currentUser.profile.values ? currentUser.profile.values.map(item => {
        return {
            id: item.id,
            title: item.i18n[0].title
        }
    }) : [];

    let headerStyle = null;

    if (hasProfileCover) {
        let newCover = `${s3BucketURL}/${profilesFolder}/cover.jpg?${Date.now()}-${forceCoverRender}`;
        headerStyle = { background: `url(${newCover})` };
    }
    else if (coverBackground) {
        headerStyle = { background: coverBackground }
    }

    const avatarText = () => {
        if (firstName && lastName)
            return `${firstName.slice(0, 1).toUpperCase()}${lastName.slice(0, 1).toUpperCase()}`
        else if (email)
            return email.slice(0, 1).toUpperCase();
        else return '';
    }

    let avatar =
        (!localUserData.loading && currentUser.profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/avatar.jpg?${localUserData.localUser.timestamp}` : null

    const lang = props.match.params.lang;

    return (
        <div className='header' style={headerStyle || null}>
            <Grid container className='headerLinks'>
                <Grid item md={3} sm={12} xs={12} className='userAvatar'>
                    <Avatar alt={firstName} src={avatar} key={avatar} className='avatar'>
                        {!avatar && avatarText()}
                    </Avatar>
                    {editMode &&
                        <React.Fragment>
                            <label htmlFor="uploadProfileImg">
                                <S3Uploader
                                    id="uploadProfileImg"
                                    name="uploadProfileImg"
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
                                    scrubFilename={(filename) => renameFile(filename)}

                                />
                                <Button component='span' className='badgeRoot' disabled={isUploading}>
                                    <Icon>
                                        camera_alt
                                    </Icon>
                                </Button>
                            </label>
                            {isUploading &&
                                <CircularProgress
                                    className='avatarLoadCircle'
                                    value={uploadProgress}
                                    size={130}
                                    variant='determinate'
                                    thickness={2}
                                />
                            }
                            <ColorPicker
                                colorPickerAnchor={colorPickerAnchor}
                                onClose={closeColorPicker}
                                refetchBgImage={refetchBgImage}
                                profile={currentUser.profile}
                            />
                            <IconButton component={Link} to={`/${lang}/dashboard/profile/settings`}>
                                <Icon>settings</Icon>
                            </IconButton>
                        </React.Fragment>
                    }
                    <div className='avatarTexts'>
                        <h3>{firstName || email}</h3>
                        <h4>Manager</h4>
                        {editMode &&
                            <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                                <span className='text'>Change Background</span>
                                <Icon className='icon'>brush</Icon>
                            </Button>
                        }
                    </div>
                </Grid>
                <Grid item md={3} sm={12} xs={12} className='rightHeaderLinks'>
                    <FormattedMessage id="userProfile.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/profile`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="userProfile.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/profile/feed/`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="userProfile.follow" defaultMessage="Follow" description="User header follow button">
                        {(text) => (
                            <Button className='headerButton'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                </Grid>
            </Grid>

            <Grid container className='headerStories' spacing={8}>
                <Hidden smDown>
                    {
                        featuredArticles && featuredArticles.map((story, index) => (
                            <Grid item className='storyContainer' key={`headerStory - ${index}`}>
                                <img src={story.img} alt="ceva" className='storyImg' />
                                <span className='storyTitle'>{story.title}</span>
                                {
                                    editMode &&
                                    <Button
                                        variant='fab'
                                        size='small'
                                        onClick={() => removeStory(index)}
                                        classes={{
                                            fab: 'removeStoryBtn'
                                        }}
                                    >
                                        <Icon>close</Icon>
                                    </Button>
                                }
                            </Grid>
                        ))
                    }
                    {
                        editMode &&
                        <Grid item className='storyContainer add' onClick={(event) => toggleStoryEditor(event.target)}>
                            <span className='bigPlus'>+</span>
                            <span className='storyTitle'>+ Add story</span>
                        </Grid>
                    }
                    {
                        editMode &&
                        <AddStoryPopup
                            anchor={storyEditorAnchor}
                            onClose={closeStoryEditor}
                        />
                    }
                </Hidden>

                <Hidden mdUp>
                    <div className='storySliderContainer'>
                        {
                            featuredArticles &&
                            <div className='storiesSlider'>
                                {
                                    featuredArticles.map((story, index) => {
                                        let itemClass = index === activeItem ? 'storyItem active' : 'storyItem';
                                        return (
                                            <div className={itemClass} key={`headerStory - ${index}`}>
                                                <img src={story.img} alt="ceva" className='storyImg' />
                                                <span className='storyTitle'>{story.title}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className='storySliderControls'>
                        <IconButton className='sliderArrow' onClick={prevItem}>
                            <Icon>arrow_back_ios</Icon>
                        </IconButton>
                        {
                            featuredArticles && featuredArticles.map((item, index) => {
                                return (<span className={index === activeItem ? 'sliderDot active' : 'sliderDot'} key={`storyMarker - ${index}`} onClick={() => jumpToItem(index)}></span>)
                            })
                        }
                        <IconButton className='sliderArrow' onClick={nextItem}>
                            <Icon>arrow_forward_ios</Icon>
                        </IconButton>
                    </div>
                </Hidden>
            </Grid>

            <Grid container className='headerSkills'>
                <Grid item lg={8} md={8} sm={12} xs={12} className={editMode ? 'skillsContainer edit' : 'skillsContainer'}>
                    <div className='skillsWrapper'>
                        <FormattedMessage id="userProfile.softSkills" defaultMessage="Soft skills" description="User header soft skills">
                            {(text) => (<span className='headerSkillsTitle softSkills'>{text}:</span>)}
                        </FormattedMessage>
                        {!editMode && skills &&
                            skills.map((item, index) => <Chip label={item.title} className='chip skills' key={`softSkill - ${index}`} />)
                        }
                        {
                            editMode && skills &&
                            <span>{skills.map(item => item.title).join(', ')}</span>
                        }
                        {
                            editMode &&
                            <Button
                                variant='fab'
                                size='small'
                                color='primary'
                                onClick={(event) => openSkillsModal('skills', event.target)}
                                classes={{
                                    fab: 'circleEditBtn'
                                }}
                            >
                                <Icon>edit</Icon>
                            </Button>
                        }
                    </div>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12} className={editMode ? 'skillsContainer edit' : 'skillsContainer'}>
                    <div className='skillsWrapper'>
                        <FormattedMessage id="userProfile.values" defaultMessage="Values" description="User header values">
                            {(text) => (<span className='headerSkillsTitle values'>{text}:</span>)}
                        </FormattedMessage>
                        {!editMode && values &&
                            values.map((item, index) => <Chip label={item.title} className='chip values' key={`value - ${index}`} />)
                        }
                        {
                            editMode && values &&
                            <span>{values.map(item => item.title).join(', ')}</span>
                        }
                        {
                            editMode &&
                            <Button
                                variant='fab'
                                size='small'
                                color='primary'
                                onClick={(event) => openSkillsModal('values', event.target)}
                                classes={{
                                    fab: 'circleEditBtn'
                                }}
                            >
                                <Icon>edit</Icon>
                            </Button>
                        }
                    </div>
                </Grid>
                <SkillsEditor skillsModalData={skillsModalData} skillsAnchor={skillsAnchor} closeSkillsModal={closeSkillsModal} key={skillsModalData} />
            </Grid>
        </div>
    )
}


export default HeaderHOC(Header);