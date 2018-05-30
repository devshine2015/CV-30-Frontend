import React from 'react';
import { Grid, Avatar, Button, Chip } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Switch, Route } from 'react-router-dom';
import classNames from 'classnames';
import UserProfileShow from './show';
import UserProfileFeed from './feed';

const UserProfile = ({ match, classes, headerStories, headerSoftSkills, headerValues }) => {
    const lang = match.params.lang;
    return <div className={classes.root}>
        <div className={classes.header}>
            <Grid container className={classes.headerLinks}>
                <Grid item md={3} sm={6} xs={6} className={classes.userAvatar}>
                    <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className={classes.avatar} />
                    <div className={classes.avatarTexts}>
                        <h3 className={classes.headerName}>Gabriel</h3>
                        <h4 className={classes.headerTitle}>Manager</h4>
                    </div>
                </Grid>
                <Grid item md={3} sm={6} xs={6} className={classes.userLinks}>
                    <FormattedMessage id="userProfile.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/profile`} className={classes.headerLink}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="userProfile.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/dashboard/profile/feed/`} className={classes.headerLink}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="userProfile.follow" defaultMessage="Follow" description="User header follow button">
                        {(text) => (
                            <Button className={classes.headerButton}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                </Grid>
            </Grid>

            <Grid container className={classes.headerStories} spacing={8}>
                {
                    headerStories.map((story, index) => (
                        <Grid item className={classes.storyContainer} key={`headerStory-${index}`}>
                            <img src={story.img} alt="ceva" className={classes.storyImg} />
                            <span className={classes.storyTitle}>{story.title}</span>
                        </Grid>
                    ))
                }</Grid>

            <Grid container className={classes.headerSkills}>
                <Grid item xs={12} className={classes.skillsContainer}>
                    <FormattedMessage id="userProfile.softSkills" defaultMessage="Soft skills" description="User header soft skills">
                        {(text) => (<span className={classNames(classes.headerSkillsTitle, classes.softSkills)}>{text}:</span>)}
                    </FormattedMessage>
                    {
                        headerSoftSkills.map((item, index) => <Chip label={item} className={classNames(classes.chip, classes.chipSkills)} key={`softSkill-${index}`} />)
                    }
                </Grid>
                <Grid item xs={12} className={classes.skillsContainer}>
                    <FormattedMessage id="userProfile.values" defaultMessage="Values" description="User header values">
                        {(text) => (<span className={classNames(classes.headerSkillsTitle, classes.values)}>{text}:</span>)}
                    </FormattedMessage>
                    {
                        headerValues.map((item, index) => <Chip label={item} className={classNames(classes.chip, classes.chipValues)} key={`value-${index}`} />)
                    }
                </Grid>
            </Grid>
        </div>

        <div className={classes.mainBody}>
            <React.Fragment>
                <Switch>
                    <Route exact path='/:lang(en|ro)/dashboard/profile' component={UserProfileShow} />
                    <Route exact path='/:lang(en|ro)/dashboard/profile/feed' component={UserProfileFeed} />
                </Switch>
            </React.Fragment>
        </div>
    </div>
}

export default UserProfile;