import React from 'react';
import { Grid, Avatar, Button, Icon, Hidden, IconButton, Chip } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from "recompose";
import { FormattedMessage } from 'react-intl';
import { NavLink, withRouter } from 'react-router-dom';
import S3Uploader from 'react-s3-uploader';
import ColorPicker from './colorPicker';
import SkillsEditor from './skillsEditor';

import slider from '../../../../hocs/slider';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';

const HeaderHOC = compose(
    withRouter,
    withState('headerStories', 'setHeaderStories', ({ data }) => data.headerStories || []),
    withState('count', 'setCount', ({ data }) => data.headerStories.length - 1),
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('skillsAnchor', 'setSkillsAnchor', null),
    withState('skillsModalData', 'setSkillsModalData', null),
    withState('avatar', 'setAvatar', ({ data }) => `${s3BucketURL}/${profilesFolder}/avatar.jpg?${Date.now()}`),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        openSkillsModal: ({ data, setSkillsAnchor, setSkillsModalData }) => (type, target) => {
            const { softSkills, values } = data;
            if (type === 'values')
                setSkillsModalData(values);
            if (type === 'skills')
                setSkillsModalData(softSkills);
            setSkillsAnchor(target);
        },
        closeSkillsModal: ({ setSkillsAnchor }) => () => {
            setSkillsAnchor(null);
        },
        removeStory: ({ headerStories, setHeaderStories }) => index => {
            let stories = [...headerStories];
            stories.splice(index, 1);
            setHeaderStories(stories);
        },
        renameFile: () => filename => {
            debugger;
            let getExtension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');
            return fName;
        },
        onProgress: () => () => { },
        onError: () => error => {
            console.log(error);
        },
        onFinish: ({ setAvatar }) => () => {
            let newAvatar = `${s3BucketURL}/${profilesFolder}/avatar.jpg?${Date.now()}`;
            setAvatar(newAvatar);
            console.log('finished!');
        },
    }),
    slider,
    pure
);


const Header = (props) => {
    const { editMode, data,
        closeColorPicker, toggleColorPicker, colorPickerAnchor, removeStory,
        activeItem, prevItem, jumpToItem, nextItem,
        openSkillsModal,
        skillsModalData,
        skillsAnchor,
        closeSkillsModal,
        headerStories,
        renameFile, onProgress, onError, onFinish, avatar
    } = props;
    const {
        availableColors,
        softSkills,
        values,
    } = data;
    const lang = props.match.params.lang;

    const getSignedUrl = async (file, callback) => {
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
    }

    return (
        <div className='header'>
            <Grid container className='headerLinks'>
                <Grid item md={3} sm={12} xs={12} className='userAvatar'>
                    <Avatar alt="Gabriel" src={avatar} key={avatar} className='avatar' />
                    {editMode &&
                        <React.Fragment>
                            <label htmlFor="fileUpload">
                                <S3Uploader
                                    id="fileUpload"
                                    name="fileUpload"
                                    className='hiddenInput'
                                    getSignedUrl={getSignedUrl}
                                    accept="image/*"
                                    onProgress={onProgress}
                                    onError={onError}
                                    onFinish={onFinish}
                                    uploadRequestHeaders={{
                                        'x-amz-acl': 'public-read',
                                    }}
                                    scrubFilename={(filename) => renameFile(filename)}
                                />
                                <Button component='span' className='badgeRoot'>
                                    <Icon>
                                        camera_alt
                                    </Icon>
                                </Button>
                            </label>

                            <ColorPicker colorPickerAnchor={colorPickerAnchor} onClose={closeColorPicker} availableColors={availableColors} />
                        </React.Fragment>
                    }
                    <div className='avatarTexts'>
                        <h3>Gabriel</h3>
                        <h4>Manager</h4>
                        {editMode &&
                            <Button size='small' className='colorPickerButton' disableRipple onClick={toggleColorPicker}>
                                <span className='text'>Change Background</span>
                                <Icon className='icon'>brush</Icon>
                            </Button>
                        }
                    </div>
                </Grid>
                <Grid item md={3} sm={12} xs={12} className='userLinks'>
                    <FormattedMessage id="userProfile.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/ ${lang} / dashboard / profile`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="userProfile.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/ ${lang} / dashboard / profile / feed / `} className='headerLink'>
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
                        <Grid item className='storyContainer add'>
                            <span className='bigPlus'>+</span>
                            <span className='storyTitle'>+ Add story</span>
                        </Grid>
                    }
                </Hidden>

                <Hidden mdUp>
                    <div className='storySliderContainer'>
                        <div className='storiesSlider'>
                            {
                                headerStories.map((story, index) => {
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
                    </div>
                    <div className='storySliderControls'>
                        <IconButton className='sliderArrow' onClick={prevItem}>
                            <Icon>arrow_back_ios</Icon>
                        </IconButton>
                        {
                            headerStories.map((item, index) => {
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
                        {!editMode &&
                            softSkills.map((item, index) => <Chip label={item} className='chip skills' key={`softSkill - ${index}`} />)
                        }
                        {
                            editMode &&
                            <span>{softSkills.join(', ')}</span>
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
                        {!editMode &&
                            values.map((item, index) => <Chip label={item} className='chip values' key={`value - ${index}`} />)
                        }
                        {
                            editMode &&
                            <span>{values.join(', ')}</span>
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