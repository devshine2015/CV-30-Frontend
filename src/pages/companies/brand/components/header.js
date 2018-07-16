import React from 'react';
import ReactPlayer from 'react-player';
import { Grid, Avatar, Button, Chip, Hidden, Icon, IconButton } from '@material-ui/core';
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
import { s3BucketURL } from '../../../../constants/s3';
import { companyQuery, handleArticle, handleCompany } from '../../../../store/queries';
import { graphql } from 'react-apollo';
import TeamSlider from './teamSlider';


const HeaderHOC = compose(
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(handleCompany, { name: 'handleCompany' }),
    withState('isPopUpOpen', 'setIsPopUpOpen', false),
    withState('expanded', 'updateExpanded', null),
    withState('headline', 'setHeadline', props => {
        let { companyQuery: { company: { i18n } } } = props;
        if (!i18n || !i18n[0] || !i18n[0].headline)
            return '';
        return i18n[0].headline;

    }),
    withHandlers({
        updateHeadline: ({ setHeadline }) => (text) => {
            setHeadline(text)
        },
        submitHeadline: props => async () => {
            let {
                companyQuery: { company }, handleCompany, headline, match
            } = props;

            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
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
                            language: match.params.lang,
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
        removeStory: ({ handleArticle, match }) => async article => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id: article.id
                        },
                        options: {
                            articleId: article.id,
                            companyId: match.params.companyId,
                            isFeatured: false
                        },
                        language: match.params.lang,

                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language: match.params.lang,
                            id: match.params.companyId
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
        }
    }),
    pure
)

const Header = (props) => {
    const { headline, updateHeadline, submitHeadline, match, editMode, removeStory, toggleStoryEditor, closeStoryEditor, isPopUpOpen,
        companyQuery: { company: { name, featuredArticles, location, noOfEmployees, activityField, teams } }
    } = props;
    const { lang, companyId } = match.params;

    let avatar = ''; //add logic to display avatar

    return (
        <div className='header'>
            <Hidden smDown>
                <ReactPlayer
                    url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
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
                    playing={false}
                // style={{ pointerEvents: 'none' }}
                />

                <div className='headerOverlay'></div>
            </Hidden>
            <div className='headerContents'>
                <Grid container className='headerLinks'>
                    <Grid item lg={3} md={5} sm={12} xs={12} className='userAvatar'>
                        <Avatar alt={avatar} src={avatar} className='avatar'>
                            {avatar ? null : name.charAt(0)}
                        </Avatar>
                        <div className='avatarTexts'>
                            <h3>{name}</h3>
                            <h4>Companie de bauturi</h4>
                        </div>
                        {editMode &&
                            <IconButton className='companySettingsBtn' component={Link} to={`/${lang}/dashboard/company/${companyId}/settings`}>
                                <Icon>settings</Icon>
                            </IconButton>
                        }
                    </Grid>
                    <Grid item lg={3} md={5} sm={12} xs={12} className='rightHeaderLinks'>
                        <FormattedMessage id="headerLinks.profile" defaultMessage="Profile" description="User header profile link">
                            {(text) => (
                                <Button component={NavLink} exact to={`/${lang}/dashboard/company/${companyId}`} className='headerLink'>
                                    {text}
                                </Button>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="headerLinks.feed" defaultMessage="Feed" description="User header feed link">
                            {(text) => (
                                <Button component={NavLink} exact to={`/${lang}/dashboard/company/${companyId}/feed/`} className='headerLink'>
                                    {text}
                                </Button>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="headerLinks.follow" defaultMessage="Follow" description="User header follow button">
                            {(text) => (
                                <Button className='headerButton'>
                                    {text}
                                </Button>
                            )}
                        </FormattedMessage>

                    </Grid>
                </Grid>
                <Grid container className='headerInfoContainer' style={{ pointerEvents: 'all' }}>
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
        </div>
    )
};

export default HeaderHOC(Header);