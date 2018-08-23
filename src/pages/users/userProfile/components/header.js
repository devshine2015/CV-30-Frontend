import React from 'react';
import { Grid, Avatar, Button, Icon, Hidden, Chip, CircularProgress, IconButton } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from "recompose";
import { FormattedMessage } from 'react-intl';
import { NavLink, withRouter, Link } from 'react-router-dom';
import S3Uploader from 'react-s3-uploader';
import { graphql } from 'react-apollo';
import ReactPlayer from 'react-player';
import { Redirect } from 'react-router-dom';

import ColorPicker from './colorPicker';
import SkillsEditor from './skillsEditor';
import NamePopUp from './namePopUp';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { setFeedbackMessage, updateAvatar, profileQuery, updateAvatarTimestampMutation, localUserQuery, handleArticle, handleFollow } from '../../../../store/queries';

import ArticlePopup from '../../../../components/ArticlePopup';
import ArticleSlider from '../../../../components/articleSlider';
import { defaultHeaderOverlay, defaultUserAvatar } from '../../../../constants/utils';

const HeaderHOC = compose(
    withRouter,
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(handleFollow, { name: 'handleFollow' }),
    graphql(profileQuery, {
        name: 'currentUser',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: null
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('count', 'setCount', ({ currentProfile: { profile } }) => profile.featuredArticles ? profile.featuredArticles.length - 1 : 0),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('skillsAnchor', 'setSkillsAnchor', null),
    withState('nameAnchor', 'setNameAnchor', null),
    withState('skillsModalData', 'setSkillsModalData', null),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('isArticlePopUpOpen', 'setIsArticlePopUpOpen', false),
    withState('fileType', 'setFileType', null),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        openSkillsModal: ({ currentProfile: { profile: { skills, values } }, setSkillsAnchor, setSkillsModalData }) => (type, target) => {
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
        toggleNameEditor: ({ setNameAnchor }) => event => setNameAnchor(event.target),
        closeNameEditor: ({ setNameAnchor }) => () => setNameAnchor(null),
        removeStory: ({ setFeedbackMessage, handleArticle, match: { params: { profileId } } }) => async article => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id: article.id,
                            isFeatured: false
                        },
                        language: 'en'
                    },
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: 'en',
                            id: profileId
                        }
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
        getSignedUrl: ({ currentProfile: { profile }, setFeedbackMessage }) => async (file, callback) => {
            const params = {
                fileName: `avatar.${file.type.replace('image/', '')}`,
                contentType: file.type,
                id: profile.id,
                type: 'avatar'
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
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error || error.message
                    }
                });
                callback(error);

            }
        },
        onUploadStart: ({ setIsUploading, setFileType }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setIsUploading(true);
                setFileType(file.type.replace('image/', ''))
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
        onFinishUpload: (props) => async () => {
            const { setFeedbackMessage, setIsUploading, updateAvatar, updateAvatarTimestamp, match, fileType } = props;
            try {
                await updateAvatar({
                    variables: {
                        status: true,
                        contentType: fileType
                    },
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: 'en',
                            id: match.params.profileId
                        }
                    }]
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
            setIsUploading(false);
        },
        refetchBgImage: ({ setForceCoverRender }) => () => setForceCoverRender(Date.now()),
        toggleStoryEditor: ({ setIsArticlePopUpOpen }) => () => {
            setIsArticlePopUpOpen(true);
        },
        closeStoryEditor: ({ setIsArticlePopUpOpen }) => () => {
            setIsArticlePopUpOpen(false);
        },
        toggleFollow: ({ handleFollow, match, setFeedbackMessage }) => async isFollowing => {
            try {
                await handleFollow({
                    variables: {
                        details: {
                            userToFollowId: match.params.profileId,
                            isFollowing: !isFollowing
                        }
                    },
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'profileQuery',
                        variables: {
                            language: match.params.lang,
                            id: match.params.profileId
                        }
                    }, {
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: match.params.lang
                        }
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
        }
    }),
    pure
);


const Header = props => {
    const { currentProfile: { profile } } = props;
    const { lang, profileId } = props.match.params;

    if (!profile || (profileId && profile.id !== profileId))
        return <Redirect to={`/${props.match.params.lang}/myProfile/`} />;

    const {
        getEditMode: { editMode: { status: editMode } },
        closeColorPicker, toggleColorPicker, colorPickerAnchor,
        removeStory,
        openSkillsModal, skillsModalData, skillsAnchor, closeSkillsModal,
        getSignedUrl, onProgress, onError, onFinishUpload, onUploadStart, isUploading, uploadProgress,
        localUserData, refetchBgImage, forceCoverRender,
        isArticlePopUpOpen, toggleStoryEditor, closeStoryEditor,
        toggleFollow, currentUser,
        toggleNameEditor, closeNameEditor, nameAnchor
    } = props;

    const {
        firstName,
        lastName,
        email,
        position,
        featuredArticles,
        // skills,
        // values,
        coverBackground, hasProfileCover
    } = profile;

    const skills = profile.skills ? profile.skills.map(item => {
        return {
            id: item.id,
            title: item.i18n[0].title
        }
    }) : [];

    const values = profile.values ? profile.values.map(item => {
        return {
            id: item.id,
            title: item.i18n[0].title
        }
    }) : [];

    let headerStyle = null;

    if (coverBackground) {
        headerStyle = { background: coverBackground }
    } else {
        headerStyle = { background: defaultHeaderOverlay }
    }

    if (hasProfileCover) {
        let newCover = `${s3BucketURL}/${profilesFolder}/${profile.id}/cover.${profile.profileCoverContentType}?${forceCoverRender}`;
        headerStyle.background += `, url(${newCover})`;
    }

    let avatar =
        (!localUserData.loading && profile.hasAvatar) ?
            `${s3BucketURL}/${profilesFolder}/${profile.id}/avatar.${profile.avatarContentType}?${localUserData.localUser.timestamp}`
            : defaultUserAvatar;

    let isFollowAllowed = !currentUser.loading && currentUser.profile && profileId;
    let isFollowing = false;
    if (isFollowAllowed) {
        const { profile: { id: currentUserId, followees } } = currentUser;
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
                                type='profile'
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
                                    <span className='text'>Change Background</span>
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

                    <FormattedMessage id="userProfile.follow" defaultMessage={isFollowing ? "Unfollow" : "Follow"} description="User header follow button">
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
                                        <span className='storyTitle'>{story.i18n[0].title}</span>
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
                            <span className='storyTitle'>+ Add article</span>
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