import React from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { compose, withState, withHandlers } from 'recompose';
import ReactPlayer from 'react-player';

import ArticleSlider from '../../../../components/articleSlider';
import ArticlePopUp from '../../../../components/ArticlePopup';
import MembersPopup from './memberPopup';
import { handleTeamMember, setFeedbackMessage, handleShallowUser, handleArticle } from '../../../../store/queries';
import { teamRefetch } from '../../../../store/refetch';
import { graphql } from '../../../../../node_modules/react-apollo';
import ShowMember from './showMember';
import { s3BucketURL } from '../../../../constants/s3';

const ShowHOC = compose(
    graphql(handleTeamMember, { name: 'handleTeamMemberMutation' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(handleShallowUser, { name: 'handleShallowUserMutation' }),
    graphql(handleArticle, { name: 'handleArticle' }),
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
        removeMember: ({ handleTeamMemberMutation, setFeedbackMessage, match: { params: { lang, teamId } } }) => async memberId => {
            try {
                await handleTeamMemberMutation({
                    variables: {
                        teamId,
                        memberId,
                        add: false
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
        removeShallowMember: ({ handleShallowUserMutation, setFeedbackMessage, match: { params: { lang, teamId } } }) => async memberId => {
            try {
                await handleShallowUserMutation({
                    variables: {
                        options: {
                            shallowUserId: memberId,
                            teamId,
                            isMember: false
                        }
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
        deleteOfficeArticle: ({ handleArticle, setFeedbackMessage, match: { params: { teamId, lang: language } } }) => async id => {
            try {
                await handleArticle({
                    variables: {
                        article: {
                            id
                        },
                        options: {
                            articleId: id,
                            teamId,
                            isAtOffice: false
                        },
                        language
                    },
                    refetchQueries: [
                        teamRefetch(teamId, language)
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
    })
);

const Show = props => {
    const {
        getEditMode: { editMode: { status: editMode } },
        isArticlePopupOpen, openArticlePopUp, closeArticlePopUp,
        isMembersPopupOpen, openMembersPopup, closeMembersPopup,
        match: { params: { lang, teamId } },
        queryTeam: { team: { company, members, shallowMembers, officeArticles, jobs } },
        removeMember, removeShallowMember, deleteOfficeArticle
    } = props;

    return (
        <Grid container className='mainBody teamShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='teamMembers'>
                    <h2 className='titleHeading'>Team<b>members</b></h2>
                    <div className='teamMembersContainer'>
                        {members && members.map(profile =>
                            <ShowMember
                                key={profile.id}
                                profile={profile}
                                removeMember={removeMember}
                                editMode={editMode}
                                type='user'
                            />
                        )}
                        {shallowMembers && shallowMembers.map(profile =>
                            <ShowMember
                                key={profile.id}
                                profile={profile}
                                removeMember={removeShallowMember}
                                editMode={editMode}
                                type='shallow'
                            />
                        )}
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
                            editMode={editMode}
                            deleteArticle={deleteOfficeArticle}
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
                                console.log(job);
                                return (
                                    <div className='jobItem' key={job.id}>
                                        <div className='media'>
                                            {(job.imagePath || job.videoUrl) ?
                                                <React.Fragment>
                                                    {
                                                        job.imagePath && <img src={`${s3BucketURL}${job.imagePath}`} alt={job.id} />
                                                    }
                                                    {(job.videoUrl && !job.imagePath) &&
                                                        <ReactPlayer
                                                            url={job.videoUrl}
                                                            width='250px'
                                                            height='140px'
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
                                                            playing={false} />}
                                                </React.Fragment> :
                                                <div className='mediaFake'>
                                                    <i className="fas fa-play fa-3x"></i>
                                                </div>
                                            }
                                            {job.level &&
                                                <span className='role'>{job.level}</span>
                                            }
                                        </div>
                                        <div className='info'>
                                            <Link to={`/${lang}/job/${job.id}`}>
                                                <h5 className='jobTitle'>{job.i18n[0].title}</h5>
                                                <p className='details'>
                                                    <FormattedDate value={job.expireDate} month='short' day='2-digit'                >
                                                        {(text) => (<span>{text}</span>)}
                                                    </FormattedDate>
                                                    <span>&nbsp;-&nbsp;{job.location}</span>
                                                </p>
                                            </Link>
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