import React from 'react';
import { Avatar } from '@material-ui/core';
import { compose, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { handleFollow, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'

import { s3BucketURL } from '../../../../constants/s3';
import { defaultUserAvatar } from '../../../../constants/utils';
import CompanyHeaderAvatar from '../../../../components/AvatarHeader/CompanyAvatarHeader';

const ShowUser = props => {
    const { profile, match: { params: { lang } }, onUnfollow } = props;
    const { id, hasAvatar, avatarPath, firstName, lastName, email } = profile;
    const avatar = avatarPath ? `${s3BucketURL}${avatarPath}` : defaultUserAvatar;
    const initials = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;
    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
    return (
        <div className='followee'>
            <Link to={`/${lang}/profile/${id}`} style={{ textDecoration: 'none' }}>
                <Avatar alt={firstName} src={avatar} className='avatar'>
                    {
                        !hasAvatar ?
                            initials
                            : null
                    }
                </Avatar>
                <span className='followeeName'>{fullName}</span>
            </Link>
            <i className='fas fa-times-circle' onClick={() => onUnfollow(id)} />
        </div>
    )
}

const ShowCompany = props => {
    const { company, onUnfollow } = props;
    const { id } = company || {};
    return (
        <div className='company'>
            <CompanyHeaderAvatar company={company} titleType='industry'/>
            <i className='fas fa-times-circle' onClick={() => onUnfollow(id)} />
        </div>
    )
}

const ShowTeam = props => {
    const { team, match: { params: { lang } }, onUnfollow } = props;
    const { id, name } = team;
    return (
        <div className='team'>
            <Link to={`/${lang}/team/${id}`} style={{ textDecoration: 'none' }}>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        {name}
                        <i className='fas fa-caret-down' />
                    </h6>
                </div>
            </Link>
            <i className='fas fa-times-circle' onClick={() => onUnfollow(id)} />
        </div>
    )
}

const ShowJob = props => {
    const { job, match: { params: { lang } }, onUnfollow } = props;
    const { id, title } = job;
    
    return (
        <div className='team'>
            <Link to={`/${lang}/job/${id}`} style={{ textDecoration: 'none' }}>
                <div className='leftOverlayTexts'>
                    <h6 className='userName'>
                        {title}
                        <i className='fas fa-caret-down' />
                    </h6>
                </div>
            </Link>
            <i className='fas fa-times-circle' onClick={() => onUnfollow(id)} />
        </div>
    )
}

const FollowingHOC = compose(
    withRouter,
    graphql(handleFollow, { name: 'handleFollowMutation' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withHandlers({
        unfollowHandler: ({ handleFollowMutation, match, setFeedbackMessage }) => async (id, category) => {
            try {
                const details = { isFollowing: false};
                switch (category) {
                    case 'user':
                        details.userToFollowId = id;
                        break;
                    case 'company':
                        details.companyId = id;
                        break;
                    case 'team':
                        details.teamId = id;
                        break;
                    case 'job':
                        details.jobId = id;
                        break;
                    default:
                        throw new Error('Not supported!');
                }
                await handleFollowMutation({
                    variables: {
                        details
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
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
    withHandlers({
        unfollowUserHandler: ({unfollowHandler}) => id => {
            unfollowHandler(id, 'user');
        },
        unfollowCompanyHandler: ({unfollowHandler}) => id => {
            unfollowHandler(id, 'company');
        },
        unfollowTeamHandler: ({unfollowHandler}) => id => {
            unfollowHandler(id, 'team');
        },
        unfollowJobHandler: ({unfollowHandler}) => id => {
            unfollowHandler(id, 'job');
        }
    }),
    pure
);

const Following = props => {
    const {
        currentProfileQuery: { profile: { followees, followingCompanies, followingTeams, followingJobs } },
        unfollowUserHandler, unfollowCompanyHandler, unfollowTeamHandler, unfollowJobHandler,
        match
    } = props;
    
    return (
        <div className='following'>
            <section className='followingCompanies'>
                <FormattedMessage id="nav.companies" defaultMessage="Companies" description="Companies">
                    {(text) => (
                        <h2 className='sectionTitle'>{text}</h2>
                    )}
                </FormattedMessage>
                {
                    followingCompanies && followingCompanies.map(item => (
                        <ShowCompany
                            key={item.id}
                            company={item}
                            onUnfollow={unfollowCompanyHandler}
                            match={match}
                        />
                    ))
                }
            </section>
            <section className='followingTeams'>
                <FormattedMessage id="company.list.teams" defaultMessage="Teams" description="Teams">
                    {(text) => (
                        <h2 className='sectionTitle'>{text}</h2>
                    )}
                </FormattedMessage>
                
                {
                    followingTeams && followingTeams.map(item => (
                        <ShowTeam
                            key={item.id}
                            team={item}
                            onUnfollow={unfollowTeamHandler}
                            match={match}
                        />
                    ))
                }
            </section>
            <section className='followingJobs'>
                <FormattedMessage id="nav.jobs" defaultMessage="Jobs" description="Jobs">
                    {(text) => (
                        <h2 className='sectionTitle'>{text}</h2>
                    )}
                </FormattedMessage>
                
                {
                    followingJobs && followingJobs.map(item => (
                        <ShowJob
                            key={item.id}
                            job={item}
                            onUnfollow={unfollowJobHandler}
                            match={match}
                        />
                    ))
                }
            </section>
            <section className='followees'>
                <FormattedMessage id="nav.people" defaultMessage="People" description="People">
                    {(text) => (
                        <h2 className='sectionTitle'>{text}</h2>
                    )}
                </FormattedMessage>
                
                {
                    followees && followees.map(item => (
                        <ShowUser
                            key={item.id}
                            profile={item}
                            onUnfollow={unfollowUserHandler}
                            match={match}
                        />
                    ))
                }
            </section>
        </div>
    );
}

export default FollowingHOC(Following);