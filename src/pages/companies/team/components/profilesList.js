import React from 'react';
import { Avatar } from '@material-ui/core';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { s3BucketURL } from '../../../../constants/s3';
import { profilesQuery, handleTeamMember, setFeedbackMessage } from '../../../../store/queries';
import { teamRefetch } from '../../../../store/refetch';
import { defaultUserAvatar } from '../../../../constants/utils';
import Loader from '../../../../components/Loader';

const ProfilesListHOC = compose(
    withRouter,
    graphql(profilesQuery, {
        name: 'profilesQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    graphql(handleTeamMember, { name: 'handleTeamMemberMutation' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withHandlers({
        addTeamMember: ({ handleTeamMemberMutation, setFeedbackMessage, match: { params: { lang, teamId } }, onClose }) => async memberId => {
            try {
                await handleTeamMemberMutation({
                    variables: {
                        teamId,
                        memberId,
                        add: true
                    },
                    refetchQueries: [
                        teamRefetch(teamId, lang)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                onClose();
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
        },
    }),
    pure
)
const ProfilesList = props => {
    const {
        profilesQuery: { loading, profiles },
        addTeamMember
    } = props;

    if (loading)
        return <Loader />

    return (
        <div className='membersContainer'>
            {profiles.map(profile => {
                const { id, avatarPath, firstName, lastName, email, position } = profile;
                let avatar = avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar;
                let fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
                return (
                    <div className='memberItem' key={id} onClick={() => addTeamMember(id)}>
                        <Avatar src={avatar} className='avatar' />
                        <div className='memberInfo'>
                            <h6 className='userName'>{fullName || email}</h6>
                            <p className='userTitle'>{position}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

export default ProfilesListHOC(ProfilesList);