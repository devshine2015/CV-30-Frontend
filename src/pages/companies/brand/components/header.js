import React from 'react';
import ReactPlayer from 'react-player';
import { Grid, Avatar, Button, Chip, Hidden, Icon, IconButton } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';
import SliderHOC from '../../../../hocs/slider';

import ArticlePopup from '../../../../components/ArticlePopup';

const Header = (props) => {
    const { match, headerStories, keyWords, editMode, removeStory, toggleStoryEditor, closeStoryEditor, storyEditorAnchor } = props;
    const lang = match.params.lang;

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
                    playing={false} />

                <div className='headerOverlay'></div>
            </Hidden>
            <div className='headerContents'>
                <Grid container className='headerLinks'>
                    <Grid item lg={3} md={5} sm={12} xs={12} className='userAvatar'>
                        <Avatar alt="John" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.png" className='avatar' />
                        <div className='avatarTexts'>
                            <h3>Ursus Romania</h3>
                            <h4>Companie de bauturi</h4>
                        </div>
                        {editMode &&
                            <IconButton className='companySettingsBtn'>
                                <Icon>settings</Icon>
                            </IconButton>
                        }
                    </Grid>
                    <Grid item lg={3} md={5} sm={12} xs={12} className='rightHeaderLinks'>
                        <FormattedMessage id="headerLinks.profile" defaultMessage="Profile" description="User header profile link">
                            {(text) => (
                                <Button component={NavLink} exact to={`/${lang}/dashboard/company`} className='headerLink'>
                                    {text}
                                </Button>
                            )}
                        </FormattedMessage>

                        <FormattedMessage id="headerLinks.feed" defaultMessage="Feed" description="User header feed link">
                            {(text) => (
                                <Button component={NavLink} exact to={`/${lang}/dashboard/company/feed/`} className='headerLink'>
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
                <Grid container className='headerInfoContainer' >
                    <Grid item lg={5} md={5} sm={12} xs={12} className='textInfo'>
                        <h1>
                            Noi suntem
                            <b>Ursus Romania</b>
                        </h1>
                        <h3>
                            Lorem ipsum dolor sit amet, cu mei reque inimicus. Exerci altera usu te.
                            </h3>
                    </Grid>
                </Grid>
                <Grid container className='headerStories'>
                    {
                        headerStories.map((story, index) => {
                            return (
                                <Grid item className='storyContainer' key={`headerStory-${index}`}>
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
                            )
                        })
                    }
                    {
                        editMode &&
                        <Grid item className='storyContainer add' onClick={(event) => toggleStoryEditor(event.target)}>
                            <span className='bigPlus'>+</span>
                            <span className='storyTitle'>+ Add featured article</span>
                        </Grid>
                    }
                    <ArticlePopup
                        anchor={storyEditorAnchor}
                        onClose={closeStoryEditor}
                    />

                </Grid>
                <Grid container className='activityFields'>
                    {
                        keyWords.map((item, index) => <Chip label={item} className='chip activity' key={`activity-${index}`} />)
                    }
                </Grid>

                <Grid container className='teamSlider'>
                    <Grid item className='teamSliderItem title'>
                        <h4>Cunoaste <b>echipa</b></h4>
                    </Grid>
                    {
                        headerStories.map((story, index) => {
                            let url = `/${lang}/dashboard/company/team`; //will add params for company id and team id
                            return (
                                <Link to={url} className='teamSliderItem' key={`teamSliderItem-${index}`}>
                                    <img src={story.img} alt="ceva" className='teamImg' />
                                    <span className='teamText'>{story.title}</span>
                                </Link>
                            )
                        })
                    }

                </Grid>
            </div>
        </div>
    )
}

const HeaderHOC = compose(
    withState('keyWords', 'setHeaderKeywords', ({ data }) => data.keyWords),
    withState('headerStories', 'setHeaderStories', ({ data }) => data.headerStories),
    withState('storyEditorAnchor', 'setStoryEditorAnchor', null),
    withState('count', 'setCount', ({ data }) => data.headerStories.length - 1),
    withState('expanded', 'updateExpanded', null),
    withHandlers({
        expandPanel: ({ updateExpanded }) => (panel) => (ev, expanded) => {
            updateExpanded(expanded ? panel : false);
        },
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
    SliderHOC,
    pure
)

export default HeaderHOC(Header);