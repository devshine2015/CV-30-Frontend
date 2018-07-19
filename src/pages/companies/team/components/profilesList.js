import React from 'react';
import { Avatar } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { profilesQuery, addMemberToTeam, queryTeam } from '../../../../store/queries';
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
    graphql(addMemberToTeam, { name: 'addMemberToTeam' }),
    withHandlers({
        addTeamMember: ({ addMemberToTeam, match: { params: { lang, teamId } }, onClose }) => async memberId => {
            try {
                await addMemberToTeam({
                    variables: {
                        teamId,
                        memberId
                    },
                    refetchQueries: [{
                        query: queryTeam,
                        fetchPolicy: 'network-only',
                        name: 'queryTeam',
                        variables: {
                            language: lang,
                            id: teamId
                        }
                    }]
                });
                onClose();
            }
            catch (err) {
                console.log(err);
            }
        },
    }),
    pure
)
const ProfilesList = props => {
    debugger;
    const {
        profilesQuery: { loading, profiles },
        addTeamMember
    } = props;

    if (loading)
        return <Loader />

    return (
        <div className='membersContainer'>
            {profiles.map(profile => {
                const { id, hasAvatar, avatarContentType, firstName, lastName, email } = profile;
                let avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : null;
                let fullName = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;
                return (
                    <div className='memberItem' key={id} onClick={() => addTeamMember(id)}>
                        <Avatar src={avatar} className='avatar'>
                            {
                                !hasAvatar ?
                                    fullName
                                    : null
                            }
                        </Avatar>
                        <div className='memberInfo'>
                            <h6 className='userName'>{`${firstName} ${lastName}`}</h6>
                            <p className='userTitle'>Manager</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

export default ProfilesListHOC(ProfilesList);