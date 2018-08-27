import React from 'react';
import { Grid, Button, Icon } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers, pure } from 'recompose';
import { NavLink, Link } from 'react-router-dom';
import ColorPicker from './colorPicker';
import { queryTeam, handleFollow, profileQuery, setFeedbackMessage } from '../../../../store/queries';
import { graphql } from 'react-apollo';

import { s3BucketURL, teamsFolder } from '../../../../constants/s3';
import { defaultHeaderOverlay } from '../../../../constants/utils';

const HeaderHOC = compose(
    graphql(handleFollow, { name: 'handleFollow' }),
    graphql(profileQuery, {
        name: 'currentProfileQuery',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: null
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
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
        toggleFollow: props => async isFollowing => {
            let {
                queryTeam: { team }, handleFollow, match, setFeedbackMessage
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
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: match.params.lang
                        }
                    }]
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
        }
    }),
    pure
);

const Header = props => {
    const {
        getEditMode: { editMode: { status: editMode } },
        match: { params: { lang, teamId } },
        queryTeam: { team: { company, coverPath, coverBackground, name } },
        colorPickerAnchor, toggleColorPicker, closeColorPicker, refetchBgImage, forceCoverRender,
        toggleFollow, currentProfileQuery
    } = props;

    const isFollowAllowed = !currentProfileQuery.loading && currentProfileQuery.profile;
    let isFollowing = false;
    if (isFollowAllowed) {
        const { profile: { followingTeams } } = currentProfileQuery;
        isFollowing = followingTeams.find(te => te.id === teamId) !== undefined;
    }

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

                    <FormattedMessage id="headerLinks.follow" defaultMessage={isFollowing ? "Unfollow" : "Follow"} description="User header follow button">
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