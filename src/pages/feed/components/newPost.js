import React from 'react';
import { Button, Icon, Avatar, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Menu, MenuItem } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';

import MediaUploadPopUp from './mediaUpload';
import { defaultUserAvatar, defaultCompanyLogo } from '../../../constants/utils';
import { s3BucketURL, profilesFolder, companiesFolder, teamsFolder } from '../../../constants/s3';
import { getNewsFeedArticles, handleArticle, setFeedbackMessage } from '../../../store/queries';


const NewPostHOC = compose(
    withRouter,
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', {
        id: uuid()
    }),
    withState('isArticle', 'updateIsArticle', false),
    withState('mediaUploadAnchor', 'setMediaUploadAnchor', null),
    withState('postAsAnchor', 'setPostAsAnchor', null),
    withState('postOptions', null, ({ profile }) => {
        let options = [
            {
                label: (profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : profile.email,
                id: profile.id,
                avatar: (profile.hasAvatar) ?
                    `${s3BucketURL}/${profilesFolder}/${profile.id}/avatar.${profile.avatarContentType}?` :
                    defaultUserAvatar,
                type: 'profile'
            }
        ];
        if (profile.ownedCompanies && profile.ownedCompanies.length > 0) {
            profile.ownedCompanies.forEach(company => {

                options.push({
                    label: company.name,
                    id: company.id,
                    avatar: company.hasLogo ? `${s3BucketURL}/${companiesFolder}/${company.id}/logo.${company.logoContentType}` : defaultCompanyLogo,
                    type: 'company'
                });
                if (company.teams && company.teams.length > 0) {
                    company.teams.forEach(team => {
                        options.push({
                            label: team.name,
                            id: team.id,
                            avatar: team.hasProfileCover ? `${s3BucketURL}/${teamsFolder}/${team.id}/cover.${team.coverContentType}` : defaultCompanyLogo,
                            type: 'team'
                        });
                    })
                }
            })
        }
        return options;
    }),
    withState('selectedPostOption', 'setSelectedPostOption', 0),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        switchIsArticle: ({ isArticle, updateIsArticle }) => () => {
            updateIsArticle(!isArticle);
        },
        addPost: ({ handleArticle, match: { params: { lang: language } }, formData, setFeedbackMessage, setFormData, postOptions, selectedPostOption }) => async () => {
            const article = {
                id: uuid(),
                isPost: true,
                title: 'Post',
                images: formData.images,
                videos: formData.videos,
                description: formData.postBody
            };
            let selectedPostAs = postOptions[selectedPostOption];

            let options = {};

            if (selectedPostAs.type === 'company') {
                options = {
                    companyId: selectedPostAs.id
                };
            }

            if (selectedPostAs.type === 'team') {
                options = {
                    teamId: selectedPostAs.id
                }
            }

            try {
                await handleArticle({
                    variables: {
                        article,
                        options,
                        language
                    },
                    refetchQueries: [{
                        query: getNewsFeedArticles,
                        fetchPolicy: 'network-only',
                        name: 'newsFeedArticlesQuery',
                        variables: {
                            language
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                setFormData({ id: uuid() });
            }
            catch (err) {
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
                console.log(err);
            }
        },
        openMediaUpload: ({ setMediaUploadAnchor }) => target => setMediaUploadAnchor(target),
        closeMediaUpload: ({ setMediaUploadAnchor, setFormData }) => (data) => {
            let { imgParams, video } = data;

            if (imgParams)
                setFormData(state => ({ ...state, 'images': [imgParams] }));
            if (video)
                setFormData(state => ({ ...state, 'videos': [video] }));

            setMediaUploadAnchor(null);
        },
        openPostAs: ({ setPostAsAnchor }) => target => setPostAsAnchor(target),
        closePostAs: ({ setPostAsAnchor }) => () => setPostAsAnchor(null),
        handlePostAsMenu: ({ setSelectedPostOption, setPostAsAnchor }) => index => {
            setSelectedPostOption(index);
            setPostAsAnchor(null);
        }
    }),
    pure
);

const NewPost = props => {
    const {
        formData: { id: postId, postBody }, handleFormChange, switchIsArticle, isArticle,
        openMediaUpload, closeMediaUpload, mediaUploadAnchor,
        openPostAs, closePostAs, postAsAnchor,
        addPost,
        match: { params: { lang } },
        postOptions, handlePostAsMenu, selectedPostOption
    } = props;

    if (isArticle)
        return <Redirect to={`/${lang}/articles/new`} />;

    return (
        <section className='newPost'>
            <div className='postHeader'>
                <div className='userProfile'>
                    <Avatar
                        className='userAvatar'
                        src={postOptions[selectedPostOption].avatar}
                        alt='userAvatar'
                    />
                    <span className='postAs'>
                        <span className='title'>Post as:</span>
                        <span className='userName'>{postOptions[selectedPostOption].label}</span>
                        {(postOptions && postOptions.length > 1) &&
                            <i className='fas fa-caret-down menuOpen' onClick={event => openPostAs(event.target)} />
                        }
                    </span>
                    <Menu
                        id="postAsMenu"
                        anchorEl={postAsAnchor}
                        open={Boolean(postAsAnchor)}
                        onClose={closePostAs}
                    >
                        {postOptions && postOptions.map((item, index) => {
                            return (
                                <MenuItem
                                    className={`postAsItem ${item.type}`}
                                    onClick={() => handlePostAsMenu(index)}
                                    selected={index === selectedPostOption}
                                    key={item.id}
                                >
                                    <Avatar src={item.avatar} className='postAsAvatar' />
                                    <div className='optionBody'>
                                        <p className='postAsLabel'>{item.label}</p>
                                        <p className='postAsType'>{item.type}</p>
                                    </div>
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </div>
                <Button className='mediaButton' onClick={event => openMediaUpload(event.target)}>
                    <Icon className='icon'>
                        camera_alt
                    </Icon>
                    <span>+ Photo / Video</span>
                </Button>
                <MediaUploadPopUp
                    anchor={mediaUploadAnchor}
                    onClose={closeMediaUpload}
                    postId={postId}
                />
            </div>
            <div className='postBody'>
                <TextField
                    name="postBody"
                    placeholder="Say something..."
                    fullWidth
                    className='textField'
                    onChange={handleFormChange}
                    value={postBody}
                    type='text'
                    multiline
                    rows={1}
                    rowsMax={10}
                    InputProps={{
                        disableUnderline: true
                    }}
                />
            </div>
            <div className='postFooter'>
                <FormGroup className='footerToggle'>
                    <FormLabel className={!isArticle ? 'active' : ''}>Post</FormLabel>
                    <ToggleSwitch checked={isArticle} onChange={switchIsArticle}
                        classes={{
                            switchBase: 'colorSwitchBase',
                            checked: 'colorChecked',
                            bar: 'colorBar',
                        }}
                        color="primary" />
                    <FormLabel className={isArticle ? 'active' : ''}>Article</FormLabel>
                </FormGroup>
                <Button className='postBtn' onClick={addPost}>
                    Post
                </Button>
            </div>
        </section>
    )
};

export default NewPostHOC(NewPost);