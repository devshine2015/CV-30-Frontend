import React from 'react';
import ReactPlayer from 'react-player';
import { Grid, Avatar, Button, Chip, Icon, IconButton, CircularProgress } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import ArticlePopup from '../../../../components/ArticlePopup';
import AddTeam from './addTeam';
import { s3BucketURL, companiesFolder } from '../../../../constants/s3';
import { companyQuery, handleArticle, handleCompany, handleFollower, currentProfileQuery } from '../../../../store/queries';
import { graphql } from 'react-apollo';
import TeamSlider from './teamSlider';

import S3Uploader from 'react-s3-uploader';
import ColorPicker from './colorPicker';
import { defaultHeaderOverlay } from '../../../../constants/utils';

const HeaderHOC = compose(
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(handleFollower, { name: 'handleFollower' }),
    graphql(currentProfileQuery, {
        name: 'currentUser',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: null
            },
            fetchPolicy: 'network-only'
        }),
    }),
    withState('isPopUpOpen', 'setIsPopUpOpen', false),
    withState('expanded', 'updateExpanded', null),
    withState('headline', 'setHeadline', props => {
        let { companyQuery: { company: { i18n } } } = props;
        if (!i18n || !i18n[0] || !i18n[0].headline)
            return '';
        return i18n[0].headline;

    }),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('fileType', 'setFileType', null),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withState('forceLogoRender', 'setForceLogoRender', 0),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        updateHeadline: ({ setHeadline }) => (text) => {
            setHeadline(text)
        },
        submitHeadline: props => async () => {
            let {
                companyQuery: { company },
                match: { params: { lang: language } },
                handleCompany, headline,
            } = props;

            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: company.id,
                            headline
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language,
                            id: company.id
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err)
            }
        },
        expandPanel: ({ updateExpanded }) => (panel) => (ev, expanded) => {
            updateExpanded(expanded ? panel : false);
        },
        removeStory: ({ handleArticle, match: { params: { lang: language, companyId } } }) => async article => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id: article.id
                        },
                        options: {
                            articleId: article.id,
                            companyId: companyId,
                            isFeatured: false
                        },
                        language
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language,
                            id: companyId
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err)
            }

        },
        toggleStoryEditor: ({ setIsPopUpOpen }) => () => {
            setIsPopUpOpen(true);
        },
        closeStoryEditor: ({ setIsPopUpOpen }) => () => {
            setIsPopUpOpen(false);
        },
        toggleFollow: props => async isFollowing => {
            let {
                companyQuery: { company }, handleFollower, match: { params: { lang: language } }
            } = props;

            try {
                await handleFollower({
                    variables: {
                        details: {
                            companyId: company.id,
                            isFollowing: !isFollowing
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language,
                            id: company.id
                        }
                    }, {
                        query: currentProfileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err)
            }
        },
        getSignedUrl: ({ companyQuery: { company } }) => async (file, callback) => {
            const params = {
                fileName: `logo.${file.type.replace('image/', '')}`,
                contentType: file.type,
                id: company.id,
                type: 'logo'
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
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: ({ setIsUploading, handleCompany, match: { params: { lang: language, companyId } }, fileType, setForceLogoRender }) => async () => {
            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: companyId,
                            hasLogo: true,
                            logoContentType: fileType
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language,
                            id: companyId
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err)
            }
            setIsUploading(false);
            setForceLogoRender(Date.now());
        },
        refetchBgImage: ({ setForceCoverRender }) => () => setForceCoverRender(Date.now()),
    }),
    pure
)

const Header = (props) => {
    const { headline, updateHeadline, submitHeadline, match, editMode, removeStory, toggleStoryEditor, closeStoryEditor, isPopUpOpen,
        companyQuery: { company: { name, featuredArticles, location, noOfEmployees, activityField, teams, hasLogo, logoContentType, hasCover, coverContentType, coverBackground } },
        getSignedUrl, onProgress, onError, onFinishUpload, onUploadStart, isUploading, uploadProgress, refetchBgImage,
        toggleColorPicker, colorPickerAnchor, closeColorPicker,
        forceLogoRender, forceCoverRender,
        // currentUser: { profile: { followingCompanies }},
        toggleFollow
    } = props;
    const { lang, companyId } = match.params;
    const isFollowing = false; /*followingCompanies.find(co => co.id === companyId) !== undefined;*/
    // let avatar = ''; //add logic to display avatar

    let avatar =
        hasLogo ? `${s3BucketURL}/${companiesFolder}/${companyId}/logo.${logoContentType}?${forceLogoRender}` : null;

    let headerStyle = null;

    if (coverBackground) {
        headerStyle = { background: coverBackground }
    } else {
        headerStyle = { background: defaultHeaderOverlay }
    }

    if (hasCover) {
        let newCover = `${s3BucketURL}/${companiesFolder}/${companyId}/cover.${coverContentType}?${forceCoverRender}`;
        headerStyle.background += `, url(${newCover})`;
    }


    return (
        <div className='header' style={headerStyle}>
            <Grid container className='headerLinks'>
                <Grid item lg={3} md={5} sm={12} xs={12} className='userAvatar'>
                    <Avatar alt={avatar} src={avatar} className='avatar'>
                        {avatar ? null : name.charAt(0)}
                    </Avatar>
                    <div className='avatarTexts'>
                        <h3>{name}</h3>
                        <h4>{activityField}</h4>
                    </div>

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
                                    size={80}
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
                            <IconButton className='companySettingsBtn' component={Link} to={`/${lang}/company/${companyId}/settings`}>
                                <Icon>settings</Icon>
                            </IconButton>
                        </React.Fragment>
                    }
                </Grid>
                <Grid item lg={3} md={5} sm={12} xs={12} className='rightHeaderLinks'>
                    <FormattedMessage id="headerLinks.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/company/${companyId}`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/company/${companyId}/feed/`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.follow" defaultMessage={isFollowing ? "Unfollow" : "Follow"} description="User header follow button">
                        {(text) => (
                            <Button className='headerButton' onClick={() => toggleFollow(isFollowing)}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                </Grid>
            </Grid>
            {editMode &&
                <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                    <span className='text'>Change Background</span>
                    <Icon className='icon'>brush</Icon>
                </Button>
            }
            <Grid container className='headerInfoContainer'>
                <Grid item lg={5} md={5} sm={12} xs={12} className='textInfo'>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FroalaEditor
                                    config={{
                                        placeholderText: 'This is where the company headline should be',
                                        iconsTemplate: 'font_awesome_5',
                                        toolbarInline: true,
                                        charCounterCount: false,
                                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                    }}
                                    model={headline}
                                    onModelChange={updateHeadline}
                                />
                                <IconButton className='submitBtn' onClick={submitHeadline}>
                                    <Icon>done</Icon>
                                </IconButton>
                            </div>
                            : <span dangerouslySetInnerHTML={{ __html: headline }} />
                    }
                </Grid>
            </Grid>
            <Grid container className='headerStories'>
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
                                {image &&
                                    <img src={image} alt={story.id} className='storyImg' />
                                }
                                {(video && !image) &&
                                    <ReactPlayer
                                        url={video}
                                        width='200px'
                                        height='140px'
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
                    <Grid item className='storyContainer add' onClick={toggleStoryEditor}>
                        <span className='bigPlus'>+</span>
                        <span className='storyTitle'>+ Add featured article</span>
                    </Grid>
                }
                <ArticlePopup
                    open={isPopUpOpen}
                    onClose={closeStoryEditor}
                    type='company_featured'
                />

            </Grid>
            <Grid container className='activityFields'>
                <Chip label={activityField} className='chip activity' />
                <Chip label={location} className='chip activity' />
                <Chip label={noOfEmployees} className='chip activity' />
            </Grid>

            <Grid container className='teamSlider'>
                <Grid item lg={9} md={9} sm={12} xs={12} className='slideContainer'>
                    <div className='teamSliderItem title'>
                        <h4>Cunoaste <b>echipa</b></h4>
                        {editMode && <AddTeam {...props} />}
                    </div>
                    {
                        (teams && teams.length > 0) &&
                        <TeamSlider teams={teams} match={match} />
                    }
                </Grid>
            </Grid>
        </div>
    )
};

export default HeaderHOC(Header);