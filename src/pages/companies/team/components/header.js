import React from 'react';
import { Grid, Button, Icon } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';
import ColorPicker from './colorPicker';
import { queryTeam, handleFollow, currentProfileQuery } from '../../../../store/queries';
import { graphql } from 'react-apollo';

import { s3BucketURL, teamsFolder } from '../../../../constants/s3';
import { defaultHeaderOverlay } from '../../../../constants/utils';

const HeaderHOC = compose(
    graphql(handleFollow, { name: 'handleFollow' }),
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
    withState('colorPickerAnchor', 'setColorPickerAnchor', null),
    withState('forceCoverRender', 'setForceCoverRender', 0),
    withHandlers({
        toggleColorPicker: ({ setColorPickerAnchor }) => (event) => {
            setColorPickerAnchor(event.target);
        },
        closeColorPicker: ({ setColorPickerAnchor }) => () => {
            setColorPickerAnchor(null);
        },
        refetchBgImage: ({ setForceCoverRender }) => () => setForceCoverRender(Date.now()),
        toggleFollow: props => async (isFollowing) => {
            let {
                queryTeam: { team }, handleFollow, match
            } = props;

            try {
                await handleFollow({
                    variables: {
                        details: {
                            teamId: team.id,
                            isFollowing: !isFollowing
                        }
                    },
                    refetchQueries: [{
                        query: queryTeam,
                        fetchPolicy: 'network-only',
                        name: 'queryTeam',
                        variables: {
                            language: match.params.lang,
                            id: team.id
                        }
                    }, {
                        query: currentProfileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: match.params.lang
                        }
                    }]
                });
            }
            catch (err) {
                console.log(err)
            }
        }
    }),
    pure
);

const Header = props => {
    const {
        editMode,
        match: { params: { lang, teamId } },
        queryTeam: { team: { company, hasProfileCover, coverContentType, coverBackground, name } },
        colorPickerAnchor, toggleColorPicker, closeColorPicker, refetchBgImage, forceCoverRender,
        toggleFollow, currentUser
    } = props;

    const isFollowAllowed = !currentUser.loading && currentUser.profile;
    let isFollowing = false;
    if (isFollowAllowed) {
        const { profile: { followingTeams } } = currentUser;
        isFollowing = followingTeams.find(te=> te.id === teamId) !== undefined;
    }   

    let headerStyle = null;

    if (coverBackground) {
        headerStyle = { background: coverBackground }
    } else {
        headerStyle = { background: defaultHeaderOverlay }
    }

    if (hasProfileCover) {
        let newCover = `${s3BucketURL}/${teamsFolder}/${teamId}/cover.${coverContentType}?${forceCoverRender}`;
        headerStyle.background += `, url(${newCover})`;
    }

    return (
        <div className='header' style={headerStyle || null}>
            <Grid container className='headerLinks'>
                <Grid item lg={3} md={5} sm={12} xs={12} className='leftHeaderLinks'>
                    <FormattedMessage id="headerLinks.backTo" defaultMessage="Back to" description="User header back to link">
                        {(text) => (
                            <Button component={Link} to={`/${lang}/company/${company.id}`} className='backButton'>
                                <i className='fas fa-angle-left' />
                                {text}&nbsp;{company.name}
                            </Button>
                        )}
                    </FormattedMessage>
                    <span className='teamName'>{name}</span>
                </Grid>
                <Grid item lg={3} md={5} sm={12} xs={12} className='rightHeaderLinks'>
                    <FormattedMessage id="headerLinks.profile" defaultMessage="Profile" description="User header profile link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/team/${teamId}`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.feed" defaultMessage="Feed" description="User header feed link">
                        {(text) => (
                            <Button component={NavLink} exact to={`/${lang}/team/${teamId}/feed/`} className='headerLink'>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>

                    <FormattedMessage id="headerLinks.follow" defaultMessage={isFollowing?"Unfollow":"Follow"} description="User header follow button">
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
                    <span className='text'>Change Background</span>
                    <Icon className='icon'>brush</Icon>
                </Button>
            }
            <ColorPicker
                colorPickerAnchor={colorPickerAnchor}
                onClose={closeColorPicker}
                match={props.match}
                company={company}
                refetchBgImage={refetchBgImage}
            />
        </div>
    );
}

export default HeaderHOC(Header);