import React from 'react';
import ReactPlayer from 'react-player';
import { Grid, Avatar, Button, Chip, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Switch, Route } from 'react-router-dom';

import CompanyShow from './show';
import CompanyFeed from './feed';

const Brand = (props) => {
    const { match, headerStories, keyWords, expanded, expandPanel } = props;
    let lang = match.params.lang;

    const Show = (props) => {
        return (<CompanyShow expanded={expanded} expandPanel={expandPanel} />)
    }

    return (
        <div className='brandRoot'>
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
                            <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className='avatar' />
                            <div className='avatarTexts'>
                                <h3>Ursus Romania</h3>
                                <h4>Companie de bauturi</h4>
                            </div>
                        </Grid>
                        <Grid item lg={3} md={5} sm={12} xs={12} className='userLinks'>
                            <FormattedMessage id="userProfile.profile" defaultMessage="Profile" description="User header profile link">
                                {(text) => (
                                    <Button component={NavLink} exact to={`/${lang}/dashboard/companies`} className='headerLink'>
                                        {text}
                                    </Button>
                                )}
                            </FormattedMessage>

                            <FormattedMessage id="userProfile.feed" defaultMessage="Feed" description="User header feed link">
                                {(text) => (
                                    <Button component={NavLink} exact to={`/${lang}/dashboard/companies/feed/`} className='headerLink'>
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
                                    </Grid>
                                )
                            })
                        }
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
                                return (
                                    <Grid item className='teamSliderItem' key={`teamSliderItem-${index}`}>
                                        <img src={story.img} alt="ceva" className='teamImg' />
                                        <span className='teamText'>{story.title}</span>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </div>
            </div>

            <React.Fragment>
                <Switch>
                    <Route exact path='/:lang(en|ro)/dashboard/companies' component={Show} />
                    <Route exact path='/:lang(en|ro)/dashboard/companies/feed' component={CompanyFeed} />
                </Switch>
            </React.Fragment>
        </div>
    )
};

export default Brand;