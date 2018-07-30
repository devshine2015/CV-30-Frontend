import React from 'react';
import { Grid, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { compose, withState, withHandlers } from 'recompose';


import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import ArticleSlider from '../../../../components/articleSlider';
import ArticlePopUp from '../../../../components/ArticlePopup';
import MembersPopup from './memberPopup';
import { removeMemberFromTeam, queryTeam, setFeedbackMessage } from '../../../../store/queries';
import { graphql } from '../../../../../node_modules/react-apollo';

const ShowHOC = compose(
    graphql(removeMemberFromTeam, { name: 'removeMemberFromTeam' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('isArticlePopupOpen', 'setIsArticlePopupOpen', false),
    withState('isMembersPopupOpen', 'setIsMembersPopupOpen', false),
    withHandlers({
        openArticlePopUp: ({ setIsArticlePopupOpen }) => () => {
            setIsArticlePopupOpen(true);
        },
        closeArticlePopUp: ({ setIsArticlePopupOpen }) => () => {
            setIsArticlePopupOpen(false);
        },
        openMembersPopup: ({ setIsMembersPopupOpen }) => () => {
            setIsMembersPopupOpen(true);
        },
        closeMembersPopup: ({ setIsMembersPopupOpen }) => () => {
            setIsMembersPopupOpen(false);
        },
        removeMember: ({ removeMemberFromTeam, setFeedbackMessage, match: { params: { lang, teamId } } }) => async memberId => {
            try {
                await removeMemberFromTeam({
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
    })
);
const Show = props => {
    const {
        getEditMode: { editMode: { status: editMode } },
        isArticlePopupOpen, openArticlePopUp, closeArticlePopUp,
        isMembersPopupOpen, openMembersPopup, closeMembersPopup,
        match: { params: { lang, teamId } },
        queryTeam: { team: { company, members, officeArticles, jobs } },
        removeMember
    } = props;

    return (
        <Grid container className='mainBody teamShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='teamMembers'>
                    <h2 className='titleHeading'>Team<b>members</b></h2>
                    <div className='teamMembersContainer'>
                        {members && members.map(profile => {
                            const { id, hasAvatar, avatarContentType, firstName, lastName, email } = profile;
                            let avatar = hasAvatar ? `${s3BucketURL}/${profilesFolder}/${id}/avatar.${avatarContentType}` : null;
                            let initials = (firstName && lastName) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : email;
                            const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
                            return (
                                <div className='teamMember' key={id}>
                                    <Avatar src={avatar} className='avatar'>
                                        {
                                            !hasAvatar ?
                                                initials
                                                : null
                                        }
                                    </Avatar>
                                    <span className='teamMemberName'>{fullName}</span>
                                    <i className='fas fa-check-circle' onClick={() => removeMember(id)} />
                                </div>
                            )
                        })}
                    </div>
                    {editMode &&
                        <React.Fragment>
                            <div className='addItemBtn' onClick={openMembersPopup}>
                                + Add Team Member
                            </div>
                            <MembersPopup
                                open={isMembersPopupOpen}
                                onClose={closeMembersPopup}
                            />
                        </React.Fragment>
                    }
                </section>
                <section className='teamLife'>
                    {(officeArticles && officeArticles.length > 0) &&
                        <ArticleSlider
                            articles={officeArticles}
                            title={(<h2 className='titleHeading'>Life <b>at the office</b></h2>)}
                        />
                    }
                    {editMode &&
                        <React.Fragment>
                            <div className='addItemBtn' onClick={openArticlePopUp}>
                                + Add Article
                            </div>
                            <ArticlePopUp
                                type='job_officeLife'
                                open={isArticlePopupOpen}
                                onClose={closeArticlePopUp}
                            />
                        </React.Fragment>
                    }
                </section>
                <FormattedMessage id="headerLinks.backTo" defaultMessage="Back to" description="User header back to link">
                    {(text) => (
                        <Link to={`/${lang}/company/${company.id}`} className='teamBackLink'>{text}&nbsp;{company.name}</Link>
                    )}
                </FormattedMessage>

            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <h2 className="columnTitle">
                        <b>Joburile</b> echipei de inovatii
                    </h2>
                    <div className='jobs'>
                        {
                            jobs.map(job => {
                                return (
                                    <div className='jobItem' key={job.id}>
                                        <div className='media'>
                                            <div className='mediaFake'>
                                                <i className="fas fa-play fa-3x"></i>
                                            </div>
                                            <span className='role'>{job.level}</span>
                                        </div>
                                        <div className='info'>
                                            <h5>{job.title}</h5>
                                            <span>{job.date} - {job.location}</span>
                                        </div>

                                    </div>
                                )
                            })
                        }
                        {editMode &&
                            <Link className='addItemBtn' to={{
                                pathname: `/${lang}/jobs/new`,
                                state: { companyId: company.id, teamId }
                            }}>
                                + Add Job
                            </Link>
                        }
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default ShowHOC(Show);