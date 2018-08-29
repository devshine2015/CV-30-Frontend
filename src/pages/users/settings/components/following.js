import React from 'react';
import { Avatar } from '@material-ui/core';
import { compose, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { s3BucketURL } from '../../../../constants/s3';
import { defaultUserAvatar } from '../../../../constants/utils';

const ShowUser = props => {
    const { id, hasAvatar, avatarPath, firstName, lastName, email } = props.profile;
    const avatar = avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar;
    const initials = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;
    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
    return (
        <div className='followee'>
            <Avatar alt={firstName} src={avatar} className='avatar'>
                {
                    !hasAvatar ?
                        initials
                        : null
                }
            </Avatar>
            <span className='followeeName'>{fullName}</span>
            <i className='fas fa-times-circle' onClick={() => props.onUnfollow(id)} />
        </div>
    )
}

const FollowingHOC = compose(
    withRouter,
    // graphql(getJobsQuery, {
    //     name: 'getJobsQuery',
    //     options: props => ({
    //         fetchPolicy: 'network-only',
    //         variables: {
    //             language: props.match.params.lang
    //         },
    //     }),
    // }),
    withHandlers({
        unfollowUserHandler: props => id => {
            
        }
    }),
    pure
);

const Following = props => {
    const {
        currentProfileQuery: { profile: { followees, followingTeams, followingJobs, followingCompanies} },
        unfollowUserHandler
    } = props;
    console.log(followees);
    return (
        <div className='following'>
            <section className='followingCompanies'>
                <h2 className='sectionTitle'>Companies</h2>
            </section>
            <section className='followingTeams'>
                <h2 className='sectionTitle'>Teams</h2>
            </section>
            <section className='followingJobs'>
                <h2 className='sectionTitle'>Jobs</h2>
            </section>
            <section className='followees'>
                <h2 className='sectionTitle'>People</h2>
                {
                    followees && followees.map(item => (
                        <ShowUser key={item.id} profile={item} onUnfollow={unfollowUserHandler}/>
                    ))
                }
            </section>
        </div>
    );
}

export default FollowingHOC(Following);