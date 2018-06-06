import React from 'react';
import { Grid, Avatar, Button, Chip, Hidden, IconButton, Icon, FormGroup, FormLabel, Switch as ToggleSwitch } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { NavLink, Switch, Route } from 'react-router-dom';

import UserProfileShow from './show';
import UserProfileFeed from './feed';

import ColorPicker from './components/colorPicker';

const UserProfile = (props) => {
    const { match,
        headerStories, headerSoftSkills, headerValues,
        prevStoryItem, activeStoryItem, jumpToStoryItem, nextStoryItem,
        editMode, switchEditMode,
        toggleColorPicker, colorPickerAnchor, closeColorPicker, availableColors } = props;
    const lang = match.params.lang;

    return (<div className='userProfileRoot'>
        <FormGroup row className='editToggle'>
            <FormLabel className={!editMode ? 'active' : ''}>View</FormLabel>
            <ToggleSwitch checked={editMode} onChange={switchEditMode}
                classes={{
                    switchBase: 'colorSwitchBase',
                    checked: 'colorChecked',
                    bar: 'colorBar',
                }}
                color="primary" />
            <FormLabel className={editMode ? 'active' : ''}>Edit</FormLabel>
        </FormGroup>

        <div className='header'>
            <Grid container className='headerLinks'>
                <Grid item md={3} sm={12} xs={12} className='userAvatar'>
                    <Avatar alt="Gabriel" src="http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg" className='avatar' />
                    {editMode &&
                        <React.Fragment>
                            <Button variant='fab' size='small'
                                classes={{
                                    fab: 'badgeRoot'
                                }}
                                onClick={toggleColorPicker}
                            >
                                <Icon>
                                    camera_alt
                                </Icon>
                            </Button>
                            <ColorPicker colorPickerAnchor={colorPickerAnchor} onClose={closeColorPicker} availableColors={availableColors} />
                        </React.Fragment>
                    }
                    <div className='avatarTexts'>
                        <h3>Gabriel</h3>
                        <h4>Manager</h4>
                        {editMode &&
                            <Button size='small' className='colorPickerButton' disableRipple={true} onClick={toggleColorPicker}>
                                <span className='text'>Change Background</span>
                                <Icon className='icon'>brush</Icon>
                            </Button>
                        }
                    </div>
                </Grid>
                <Grid item md={3} sm={12} xs={12} className='userLinks'>
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
                        headerStories.map((story, index) => (
                            <Grid item className='storyContainer' key={`headerStory-${index}`}>
                                <img src={story.img} alt="ceva" className='storyImg' />
                                <span className='storyTitle'>{story.title}</span>
                            </Grid>
                        ))
                    }
                    {
                        editMode &&
                        <Grid item className='storyContainer add'>
                            <span className='bigPlus'>+</span>
                            <span className='storyTitle'>+ Add story</span>
                        </Grid>
                    }
                </Hidden>

                <Hidden smUp>
                    <div className='storySliderContainer'>
                        <div className='storiesSlider'>
                            {
                                headerStories.map((story, index) => {
                                    let itemClass = index === activeStoryItem ? 'storyItem active' : 'storyItem';
                                    return (
                                        <div className={itemClass} key={`headerStory-${index}`}>
                                            <img src={story.img} alt="ceva" className='storyImg' />
                                            <span className='storyTitle'>{story.title}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='storySliderControls'>
                        <IconButton className='sliderArrow' onClick={prevStoryItem}>
                            <Icon>arrow_back_ios</Icon>
                        </IconButton>
                        {
                            headerStories.map((item, index) => {
                                return (<span className={index === activeStoryItem ? 'sliderDot active' : 'sliderDot'} key={`storyMarker-${index}`} onClick={() => jumpToStoryItem(index)}></span>)
                            })
                        }
                        <IconButton className='sliderArrow' onClick={nextStoryItem}>
                            <Icon>arrow_forward_ios</Icon>
                        </IconButton>
                    </div>
                </Hidden>
            </Grid>

            <Grid container className='headerSkills'>
                <Grid item lg={8} md={8} sm={12} xs={12} className='skillsContainer'>
                    <FormattedMessage id="userProfile.softSkills" defaultMessage="Soft skills" description="User header soft skills">
                        {(text) => (<span className='headerSkillsTitle softSkills'>{text}:</span>)}
                    </FormattedMessage>
                    {
                        headerSoftSkills.map((item, index) => <Chip label={item} className='chip skills' key={`softSkill-${index}`} />)
                    }
                </Grid>
                <Grid item xs={12} className='skillsContainer'>
                    <FormattedMessage id="userProfile.values" defaultMessage="Values" description="User header values">
                        {(text) => (<span className='headerSkillsTitle values'>{text}:</span>)}
                    </FormattedMessage>
                    {
                        headerValues.map((item, index) => <Chip label={item} className='chip values' key={`value-${index}`} />)
                    }
                </Grid>
            </Grid>
        </div>

        <React.Fragment>
            <Switch>
                <Route exact path='/:lang(en|ro)/dashboard/profile' component={UserProfileShow} />
                <Route exact path='/:lang(en|ro)/dashboard/profile/feed' component={UserProfileFeed} />
            </Switch>
        </React.Fragment>
    </div>
    );
}

export default UserProfile;