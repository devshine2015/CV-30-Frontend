import React from 'react';
import ReactPlayer from 'react-player';
import { Grid, Avatar, Button, Chip, Icon, IconButton } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';
import { handleArticle, handleCompany, handleFollow, profileQuery, setFeedbackMessage } from '../../../../store/queries';
import { companyRefetch, currentProfileRefetch } from '../../../../store/refetch';

import { graphql } from 'react-apollo';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import TeamSlider from './teamSlider';
import AddTeam from './addTeam';
import ColorPicker from './colorPicker';
import ArticlePopup from '../../../../components/ArticlePopup';
import { s3BucketURL, companiesFolder } from '../../../../constants/s3';
import { defaultHeaderOverlay, defaultCompanyLogo } from '../../../../constants/utils';
import ImageUploader from '../../../../components/imageUploader';

const HeaderHOC = compose(
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(handleFollow, { name: 'handleFollow' }),
    graphql(profileQuery, {
        name: 'currentProfileQuery',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ companyQuery: { company: { headline } } }) => ({
        headline,
        isPopUpOpen: false,
        expanded: null,
        colorPickerAnchor: null,
        forceCoverRender: 0,
        forceLogoRender: 0,
        imageUploadOpen: false
    })),
    withHandlers({
        toggleColorPicker: ({ state, setState }) => (event) => {
            setState({ ...state, colorPickerAnchor: event.target });
        },
        closeColorPicker: ({ state, setState }) => () => {
            setState({ ...state, colorPickerAnchor: null });
        },
        updateHeadline: ({ state, setState }) => (headline) => {
            setState({ ...state, headline })
        },
        submitHeadline: props => async () => {
            let {
                companyQuery: { company },
                match: { params: { lang: language } },
                handleCompany, state: { headline },
                setFeedbackMessage
            } = props;

            try {
                await handleCompany({
                    variables: {
                        language,
                        details: {
                            id: company.id,
                            headline: headline || ''
                        }
                    },
                    refetchQueries: [
                        companyRefetch(company.id, language)
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
        expandPanel: ({ state, setState }) => (panel) => (_, expanded) => {
            setState({ ...state, expanded: expanded ? panel : false });
        },
        removeStory: ({ handleArticle, match: { params: { lang: language, companyId } }, setFeedbackMessage }) => async article => {
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
                    refetchQueries: [
                        companyRefetch(companyId, language)
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
        toggleStoryEditor: ({ state, setState }) => () => {
            setState({ ...state, isPopUpOpen: true });
        },
        closeStoryEditor: ({ state, setState }) => () => {
            setState({ ...state, isPopUpOpen: false });
        },
        toggleFollow: ({ companyQuery: { company }, handleFollow, match: { params: { lang: language } }, setFeedbackMessage }) => async isFollowing => {
            try {
                await handleFollow({
                    variables: {
                        details: {
                            companyId: company.id,
                            isFollowing: !isFollowing
                        }
                    },
                    refetchQueries: [
                        companyRefetch(company.id, language),
                        currentProfileRefetch(language)
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
            handleCompany, match: { params: { lang: language, companyId } },
            state, setState, setFeedbackMessage }) =>
            async ({ path, filename }) => {
                const logoPath = path ? path : `/${companiesFolder}/${companyId}/${filename}`;
                try {
                    await handleCompany({
                        variables: {
                            language,
                            details: {
                                id: companyId,
                                logoPath
                            }
                        },
                        refetchQueries: [
                            companyRefetch(companyId, language)
                        ]
                    });
                    await setFeedbackMessage({
                        variables: {
                            status: 'success',
                            message: 'File uploaded successfully.'
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
                setState({ ...state, forceLogoRender: Date.now() });
            },
        refetchBgImage: ({ state, setState }) => () => setState({ ...state, forceCoverRender: Date.now() }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false })
    }),
    pure
)

const Header = props => {
    const {
        state: {
            headline, isPopUpOpen, colorPickerAnchor, forceCoverRender, forceLogoRender, imageUploadOpen },
        getEditMode, isEditAllowed,
        updateHeadline, submitHeadline, match, removeStory, toggleStoryEditor, closeStoryEditor,
        companyQuery: { company: { name, featuredArticles, location, noOfEmployees, industry, teams, logoPath, coverPath, coverBackground } },
        toggleColorPicker, closeColorPicker,
        toggleFollow, currentProfileQuery,
        refetchBgImage, openImageUpload, closeImageUpload, handleError, handleSuccess,
    } = props;
    const editMode = isEditAllowed && getEditMode.editMode.status;

    const { lang, companyId } = match.params;

    const isFollowAllowed = !currentProfileQuery.loading && currentProfileQuery.profile && currentProfileQuery.profile.id;
    let isFollowing = false;

    if (isFollowAllowed) {
        const { profile: { followingCompanies } } = currentProfileQuery;
        isFollowing = followingCompanies.find(co => co.id === companyId) !== undefined;
    }

    let avatar =
        logoPath ? `${s3BucketURL}${logoPath}?${forceLogoRender}` : defaultCompanyLogo;

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
    
    return (
        <div className='header' style={headerStyle}>
            <Grid container className='headerLinks'>
                <Grid item lg={3} md={5} sm={12} xs={12} className='userAvatar'>
                    <Avatar alt={avatar} src={avatar} className='avatar' />
                    <div className='avatarTexts'>
                        <h3>{name}</h3>
                        { industry &&
                        (<FormattedMessage id={`industries.${industry.key}`} defaultMessage={industry.key}>
                            {(text) => (
                                <h4>{text}</h4>
                            )}
                        </FormattedMessage>)
                        }
                    </div>

                    {editMode &&
                        <React.Fragment>
                            <Button className='badgeRoot' onClick={openImageUpload}>
                                <Icon>
                                    camera_alt
                                    </Icon>
                            </Button>

                            <ImageUploader
                                type='company_logo'
                                open={imageUploadOpen}
                                onClose={closeImageUpload}
                                onError={handleError}
                                onSuccess={handleSuccess}
                                id={companyId}
                            />
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

                    <FormattedMessage id={!isFollowing? "headerLinks.follow" : "headerLinks.unFollow"} defaultMessage={isFollowing ? "Unfollow" : "Follow"} description="User header follow button">
                        {(text) => isFollowAllowed ? (
                            <Button className='headerButton' onClick={() => toggleFollow(isFollowing)}>
                                {text}
                            </Button>
                        ) : null}
                    </FormattedMessage>
                </Grid>
            </Grid>
            {editMode &&
                <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                    <FormattedMessage id="company.brand.changeBackground" defaultMessage="Change Background" description="Change Background">
                        {(text) => (
                            <span className='text'>{text}</span>
                        )}
                    </FormattedMessage>
                    
                    <Icon className='icon'>brush</Icon>
                </Button>
            }
            <Grid container className='headerInfoContainer'>
                <Grid item lg={5} md={5} sm={12} xs={12} className='textInfo'>
                    {
                        editMode ?
                            <div className='editorWrapper'>
                                <FormattedMessage id="company.brand.froalaEditor" defaultMessage="This is where the company headline should be" description="Company Headline">
                                    {(text) => (
                                        <FroalaEditor
                                            config={{
                                                placeholderText: text,
                                                iconsTemplate: 'font_awesome_5',
                                                toolbarInline: true,
                                                charCounterCount: false,
                                                toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                                            }}
                                            model={headline}
                                            onModelChange={updateHeadline}
                                        />
                                    )}
                                </FormattedMessage>
                                
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
                                <span className='storyTitle'>{story.title}</span>
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
                        <FormattedMessage id="company.brand.storyTitle" defaultMessage="+ Add featured article" description="Add featured article">
                            {(text) => (
                                <span className='storyTitle'>{text}</span>
                            )}
                        </FormattedMessage>
                        
                    </Grid>
                }
                <ArticlePopup
                    open={isPopUpOpen}
                    onClose={closeStoryEditor}
                    type='company_featured'
                />
            </Grid>
            <Grid container className='activityFields'>
                <Chip label={
                    industry && <FormattedMessage id={`industries.${industry.key}`} defaultMessage={industry.key}>
                        {(text) => (
                            <span>{text}</span>
                        )}
                    </FormattedMessage>}
                    className='chip activity'
                />
                <Chip label={location} className='chip activity' />
                <Chip label={noOfEmployees} className='chip activity' />
            </Grid>

            <Grid container className='teamSlider'>
                <Grid item lg={9} md={9} sm={12} xs={12} className='slideContainer'>
                    <div className='teamSliderItem title'>
                        <FormattedMessage id="company.brand.knowTeam" defaultMessage="Know the \n Team" description="Know the Team">
                            {(text) => (
                                <h4>{text.split("\n")[0]} <b>{text.split("\n")[2]}</b></h4>
                            )}
                        </FormattedMessage>
                        
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