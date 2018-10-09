import React from 'react';
import { Grid, Avatar, Button, Icon, Hidden, Chip, IconButton } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from "recompose";
import { injectIntl, FormattedMessage } from 'react-intl';
import { NavLink, withRouter, Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import ReactPlayer from 'react-player';
import { Redirect } from 'react-router-dom';

import ColorPicker from './colorPicker';
import SkillsEditor from './skillsEditor';
import NamePopUp from './namePopUp';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { setFeedbackMessage, updateAvatar, profileQuery, updateAvatarTimestampMutation, localUserQuery, handleArticle, handleFollow } from '../../../../store/queries';
import { currentProfileRefetch, profileRefetch } from '../../../../store/refetch';

import ArticlePopup from '../../../../components/ArticlePopup';
import ArticleSlider from '../../../../components/articleSlider';
import { defaultHeaderOverlay, defaultUserAvatar } from '../../../../constants/utils';
import ImageUploader from '../../../../components/imageUploader';

const HeaderHOC = compose(
    withRouter,
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(handleFollow, { name: 'handleFollow' }),
    graphql(profileQuery, {
        name: 'currentProfileQuery',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: null
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', {
        colorPickerAnchor: null,
        skillsAnchor: null,
        nameAnchor: null,
        skillsModalData: null,
        forceCoverRender: 0,
        isArticlePopUpOpen: false,
        imageUploadOpen: false
    }),
    withHandlers({
        toggleColorPicker: ({ state, setState }) => (event) => setState({ ...state, colorPickerAnchor: event.target }),
        closeColorPicker: ({ state, setState }) => () => setState({ ...state, colorPickerAnchor: null }),
        openSkillsModal: ({ profileQuery: { profile: { skills, values } }, state, setState }) => (type, skillsAnchor) => setState({
            ...state,
            skillsModalData: {
                type,
                data: type === 'values' ? values : skills
            },
            skillsAnchor
        }),
        closeSkillsModal: ({ state, setState }) => () => setState({ ...state, skillsModalData: null, skillsAnchor: null }),
        toggleNameEditor: ({ state, setState }) => event => setState({ ...state, nameAnchor: event.target }),
        closeNameEditor: ({ state, setState }) => () => setState({ ...state, nameAnchor: null }),
        removeStory: ({ setFeedbackMessage, handleArticle, match: { params: { profileId, lang } } }) => async article => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id: article.id,
                            isFeatured: false
                        },
                        language: 'en'
                    },
                    refetchQueries: [
                        currentProfileRefetch(lang)
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
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({
            setFeedbackMessage, updateAvatar, updateAvatarTimestamp, match,
            profileQuery: { profile: { id: profileId } } }) =>
            async data => {
                const { path, filename } = data;
                const avatarPath = path ? path : `/${profilesFolder}/${profileId}/${filename}`;
                try {
                    await updateAvatar({
                        variables: {
                            status: true,
                            path: avatarPath
                        },
                        refetchQueries: [
                            currentProfileRefetch(match.params.lang)
                        ]
                    });
                    await updateAvatarTimestamp({
                        variables: {
                            timestamp: Date.now()
                        }
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
        refetchBgImage: ({ state, setState }) => () => setState({ ...state, forceCoverRender: Date.now() }),
        toggleStoryEditor: ({ state, setState }) => () => setState({ ...state, isArticlePopUpOpen: true }),
        closeStoryEditor: ({ state, setState }) => () => setState({ ...state, isArticlePopUpOpen: false }),
        toggleFollow: ({ handleFollow, match, setFeedbackMessage }) => async isFollowing => {
            try {
                await handleFollow({
                    variables: {
                        details: {
                            userToFollowId: match.params.profileId,
                            isFollowing: !isFollowing
                        }
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang),
                        profileRefetch(match.params.profileId, match.params.lang)
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
        }
    }),
    injectIntl,
    pure
);

const Header = props => {
    const { profileQuery: { profile } } = props;
    const { lang, profileId } = props.match.params;
    
    if (!profile || (profileId && profile.id !== profileId))
        return <Redirect to={`/${props.match.params.lang}/myProfile/`} />;

    const {
        state: { colorPickerAnchor, skillsAnchor, nameAnchor, skillsModalData, forceCoverRender, isArticlePopUpOpen, imageUploadOpen },
        getEditMode, isEditAllowed,
        closeColorPicker, toggleColorPicker,
        removeStory,
        openSkillsModal, closeSkillsModal,
        localUserData, refetchBgImage,
        toggleStoryEditor, closeStoryEditor,
        toggleFollow, currentProfileQuery,
        toggleNameEditor, closeNameEditor,
        openImageUpload, closeImageUpload, handleError, handleSuccess,
        intl
    } = props;
    let editMode = false;
    try {
        editMode = isEditAllowed && getEditMode.editMode.status;
    } catch(error) {}

    const {
        firstName,
        email,
        position,
        featuredArticles,
        // skills,
        // values,
        coverBackground, coverPath
    } = profile;

    const skills = profile.skills || [];

    const values = profile.values ? profile.values.map(item => {
        return {
            id: item.id,
            title: item.title
        }
    }) : [];

    let headerStyle = null;

    if (coverBackground) {
        headerStyle = { background: coverBackground }
    } else {
        headerStyle = { background: defaultHeaderOverlay }
    }

    if (coverPath) {
        let newCover = `${s3BucketURL}${coverPath}?${forceCoverRender}`;
        headerStyle.background += `, url(${newCover})`;
    }

    let avatar =
        (!localUserData.loading && profile.avatarPath) ?
            `${s3BucketURL}${profile.avatarPath}?${localUserData.localUser.timestamp}` : defaultUserAvatar;

    let isFollowAllowed = !currentProfileQuery.loading && currentProfileQuery.profile && currentProfileQuery.profile.id;
    let isFollowing = false;

    if (isFollowAllowed) {
        const { profile: { id: currentUserId, followees } } = currentProfileQuery;
        if (currentUserId !== profileId) {
            isFollowing = followees.find(u => u.id === profileId) !== undefined;
        } else {
            isFollowAllowed = false;
        }
    }

    return (
        <div className='header' style={headerStyle}>
            <Grid container className='headerLinks'>
                <Grid item md={3} sm={12} xs={12} className='userAvatar'>
                    <Avatar alt={firstName} src={avatar} key={avatar} className='avatar' />
                    {editMode &&
                        <React.Fragment>
                            <Button className='badgeRoot' onClick={openImageUpload}>
                                <Icon>
                                    camera_alt
                                    </Icon>
                            </Button>
                            <ImageUploader
                                type='profile_avatar'
                                open={imageUploadOpen}
                                onClose={closeImageUpload}
                                onError={handleError}
                                onSuccess={handleSuccess}
                                id={profile.id}
                            />

                            <ColorPicker
                                colorPickerAnchor={colorPickerAnchor}
                                onClose={closeColorPicker}
                                refetchBgImage={refetchBgImage}
                                type='profile'
                                profile={profile}
                            />
                            <NamePopUp
                                anchor={nameAnchor}
                                onClose={closeNameEditor}
                                profile={profile}
                            />
                        </React.Fragment>
                    }
                    <div className='avatarTexts'>
                        <h3>{firstName || email}</h3>
                        <h4>{position}</h4>
                        {editMode &&
                            <React.Fragment>
                                <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                                    <FormattedMessage id="company.brand.changeBackground" defaultMessage="Change Background" description="Change Background">
                                        {(text) => (
                                            <span className='text'>{text}</span>
                                        )}
                                    </FormattedMessage>
                                    
                                    <Icon className='icon'>brush</Icon>
                                </Button>
                                <IconButton className='nameEditToggle' onClick={toggleNameEditor}>
                                    <Icon>edit</Icon>
                                </IconButton>
                            </React.Fragment>
                        }
                    </div>
                </Grid>
                <Grid item md={3} sm={12} xs={12} className='rightHeaderLinks'>
                    <FormattedMessage id="userProfile.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button
                                component={NavLink}
                                exact
                                to={props.match.params.profileId ? `/${lang}/profile/${props.match.params.profileId}` : `/${lang}/myProfile`}
                                className='headerLink'
                            >
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="userProfile.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button
                                component={NavLink}
                                exact
                                to={props.match.params.profileId ? `/${lang}/profile/${props.match.params.profileId}/feed/` : `/${lang}/myProfile/feed/`}
                                className='headerLink'
                            >
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id={isFollowing? "userProfile.unFollow" : "userProfile.follow"} defaultMessage={isFollowing ? "Unfollow" : "Follow"} description="User header follow button">
                        {(text) => isFollowAllowed ? (
                            <Button className='headerButton' onClick={() => toggleFollow(isFollowing)}>
                                {text}
                            </Button>
                        ) : null}
                    </FormattedMessage>

                </Grid>
            </Grid>

            <Grid container className='headerStories' spacing={8}>
                <Hidden smDown>
                    {
                        featuredArticles && featuredArticles.map(story => {
                            let image, video;
                            if (story.images && story.images.length > 0) {
                                image = `${s3BucketURL}${story.images[0].path}`;
                            }
                            if (story.videos && story.videos.length > 0) {
                                video = story.videos[0].path;
                            }
                            return (
                                <Grid item className='storyContainer' key={story.id}>
                                    <Link to={`/${props.match.params.lang}/article/${story.id}`}>
                                        {image &&
                                            <img src={image} alt={story.id} className='storyImg' />
                                        }
                                        {(video && !image) &&
                                            <ReactPlayer
                                                url={video}
                                                width='200'
                                                height='140'
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
                                        <span className='storyTitle'>{story.title}</span>
                                    </Link>
                                    {
                                        editMode &&
                                        <Button
                                            variant='fab'
                                            size='small'
                                            onClick={() => removeStory(story)}
                                            classes={{
                                                fab: 'removeStoryBtn'
                                            }}
                                        >
                                            <Icon>close</Icon>
                                        </Button>
                                    }
                                </Grid>
                            )
                        })
                    }
                    {
                        editMode &&
                        <Grid item className='storyContainer add' onClick={(event) => toggleStoryEditor(event.target)}>
                            <span className='bigPlus'>+</span>
                            <FormattedMessage id="company.team.addArticle" defaultMessage="+ Add article" description="Add article">
                                {(text) => (
                                    <span className='storyTitle'>{text}</span>
                                )}
                            </FormattedMessage>
                            
                        </Grid>
                    }
                    {
                        editMode &&
                        <ArticlePopup
                            open={isArticlePopUpOpen}
                            onClose={closeStoryEditor}
                            type='profile_isFeatured'
                        />
                    }
                </Hidden>

                <Hidden mdUp>

                    {
                        featuredArticles &&
                        <ArticleSlider
                            articles={featuredArticles}
                        />
                    }

                </Hidden>
            </Grid>

            <Grid container className='headerSkills'>
                <Grid item lg={8} md={8} sm={12} xs={12} className={editMode ? 'skillsContainer edit' : 'skillsContainer'}>
                    <div className='skillsWrapper'>
                        <FormattedMessage id="userProfile.softSkills" defaultMessage="Soft skills" description="User header soft skills">
                            {(text) => (<span className='headerSkillsTitle softSkills'>{text}:</span>)}
                        </FormattedMessage>
                        {!editMode && skills && skills.map(item =>
                            <FormattedMessage id={`skills.${item.key}`} defaultMessage={item.key} key={item.key}>
                                {text => <Chip label={text} className='chip skills' />}
                            </FormattedMessage>
                        )}
                        {
                            editMode && skills &&
                            <span>{skills.map(item => intl.formatMessage({ id: `skills.${item.key}` })).join(', ')}</span>
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
                <SkillsEditor refetchProfile={currentProfileQuery && currentProfileQuery.refetch} skillsModalData={skillsModalData} skillsAnchor={skillsAnchor} closeSkillsModal={closeSkillsModal} key={skillsModalData} />
            </Grid>
        </div>
    )
}

export default HeaderHOC(Header);