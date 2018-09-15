import React from 'react';
import { Button, Icon, Avatar, TextField, FormGroup, FormLabel, Switch as ToggleSwitch, Menu, MenuItem, IconButton } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { compose, withState, withHandlers, pure, withProps } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';
import ReactPlayer from 'react-player';

import MediaUploadPopUp from './mediaUpload';
import { defaultUserAvatar, defaultCompanyLogo } from '../../../constants/utils';
import { s3BucketURL } from '../../../constants/s3';
import { handleArticle, setFeedbackMessage } from '../../../store/queries';
import { newsFeedArticlesRefetch } from '../../../store/refetch';

const NewPostHOC = compose(
    withRouter,
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withProps(({ profile }) => {
        let postOptions = [
            {
                label: (profile.firstName && profile.lastName) ? `${profile.firstName} ${profile.lastName}` : profile.email,
                id: profile.id,
                avatar: (profile.avatarPath) ? `${s3BucketURL}${profile.avatarPath}` : defaultUserAvatar,
                type: 'profile'
            }
        ];
        if (profile.ownedCompanies && profile.ownedCompanies.length > 0) {
            profile.ownedCompanies.forEach(company => {
                postOptions.push({
                    label: company.name,
                    id: company.id,
                    avatar: company.logoPath ? `${s3BucketURL}${company.logoPath}` : defaultCompanyLogo,
                    type: 'company'
                });
                if (company.teams && company.teams.length > 0) {
                    company.teams.forEach(team => {
                        postOptions.push({
                            label: team.name,
                            id: team.id,
                            avatar: team.coverPath ? `${s3BucketURL}${team.coverPath}` : defaultCompanyLogo,
                            type: 'team'
                        });
                    })
                }
            })
        }
        return { postOptions };
    }),
    withState('state', 'setState', () => ({
        formData: {
            id: uuid()
        },
        isArticle: false,
        mediaUploadAnchor: null,
        postAsAnchor: null,
        selectedPostOption: 0
    })),
    withHandlers({
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({ ...state, formData: { ...state.formData, [name]: value } });
        },
        switchIsArticle: ({ state, setState }) => () => setState({ ...state, isArticle: !state.isArticle }),
        addPost: ({ handleArticle, match: { params: { lang: language } }, state, setState, setFeedbackMessage, postOptions, refetch }) => async () => {
            let selectedPostAs = postOptions[state.selectedPostOption];

            const article = {
                id: uuid(),
                isPost: true,
                title: 'Post',
                images: state.formData.images,
                videos: state.formData.videos,
                description: state.formData.postBody,
                postAs: selectedPostAs.type
            };

            if (selectedPostAs.type === 'company')
                article.postingCompanyId = selectedPostAs.id;

            if (selectedPostAs.type === 'team')
                article.postingTeamId = selectedPostAs.id;

            try {
                await handleArticle({
                    variables: {
                        article,
                        language
                    }
                    // refetchQueries: [
                    //     newsFeedArticlesRefetch(language)
                    // ]
                });
                await refetch();
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                setState({ ...state, formData: { id: uuid(), postBody: '' } });
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
        openMediaUpload: ({ state, setState }) => mediaUploadAnchor => setState({ ...state, mediaUploadAnchor }),
        closeMediaUpload: ({ state, setState }) => (data) => {
            let { imgParams, video } = data;
            let newState = { mediaUploadAnchor: null };

            if (imgParams) newState.images = [imgParams];
            if (video) newState.videos = [video];

            setState({ ...state, ...newState });
        },
        openPostAs: ({ state, setState }) => postAsAnchor => setState({ ...state, postAsAnchor }),
        closePostAs: ({ state, setState }) => () => setState({ ...state, postAsAnchor: null }),
        handlePostAsMenu: ({ state, setState }) => selectedPostOption => setState({ ...state, selectedPostOption, postAsAnchor: null }),
        removeImage: ({ state, setState }) => () => setState({ ...state, formData: { ...state.formData, images: [] } }),
        removeVideo: ({ state, setState }) => () => setState({ ...state, formData: { ...state.formData, videos: [] } })
    }),
    pure
);

const NewPost = props => {
    const {
        state: {
            formData: { id: postId, postBody, images, videos },
            isArticle,
            mediaUploadAnchor,
            postAsAnchor,
            selectedPostOption
        },
        handleFormChange, switchIsArticle,
        openMediaUpload, closeMediaUpload,
        openPostAs, closePostAs,
        addPost,
        match: { params: { lang } },
        postOptions, handlePostAsMenu,
        removeImage, removeVideo
    } = props;

    if (isArticle)
        return <Redirect to={`/${lang}/articles/new`} />;

    let image, video;
    if (images && images.length > 0) {
        image = `${s3BucketURL}${images[0].path}`;
    }
    if (videos && videos.length > 0) {
        video = videos[0].path;
    }

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
                {image &&
                    <div className="imagePreview">
                        <img src={image} className='previewImg' alt='' />
                        <IconButton className='removeBtn' onClick={removeImage}>
                            <Icon>cancel</Icon>
                        </IconButton>
                    </div>
                }
                {(video && !image) &&
                    <div className="imagePreview">
                        <ReactPlayer
                            url={video}
                            width='150px'
                            height='150px'
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
                        <IconButton className='removeBtn' onClick={removeVideo}>
                            <Icon>cancel</Icon>
                        </IconButton>
                    </div>
                }
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