import React from 'react';
import { Modal, Avatar } from '@material-ui/core';
import { compose, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { profilesQuery, addMemberToTeam, queryTeam } from '../../../../store/queries';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';

const TeamMembers = (props) => {
    const {
        open, onClose,
        profilesQuery: { profiles },
        addTeamMember
    } = props;

    return (
        <Modal
            open={open}
            classes={{
                root: 'modalRoot'
            }}
            onClose={onClose}
        >
            <div className='storyEditPaper'>
                <div className='popupHeader'>
                    <h4>Add team member</h4>
                    <p>
                        Lorem ipsum dolor sit amet, his fastidii phaedrum disputando ut, vis eu omnis intellegam, at duis voluptua signiferumque pro.
                    </p>
                </div>
                <div className='popupBody'>
                    <div className='membersContainer'>
                        {profiles.map(profile => {
                            const { id, hasAvatar, avatarContentType, firstName, lastName, email } = profile;
                            let avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : null;
                            let fullName = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;
                            return (
                                <div className='memberItem' key={profile.id} onClick={() => addTeamMember(id)}>
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
                </div>
            </div>
        </Modal>
    );
}


const TeamMembersHOC = compose(
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
        }
    }),
    pure
);

export default TeamMembersHOC(TeamMembers);