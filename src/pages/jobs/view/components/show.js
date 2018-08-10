import React from 'react';
import { Grid, Button, IconButton, Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedDate } from 'react-intl';
import { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';

import ArticleSlider from '../../../../components/articleSlider';
import Loader from '../../../../components/Loader';
import { handleApplyToJob, getJobQuery, currentProfileQuery } from '../../../../store/queries';

const ShowHOC = compose(

    graphql(handleApplyToJob, { name: 'handleApplyToJob' }),
    graphql(currentProfileQuery, {
        name: 'currentProfile',
        options: (props) => ({
            variables: {
                language: props.match.params.lang
            },
            fetchPolicy: 'network-only'
        }),
    }),
    withState('expanded', 'updateExpanded', null),
    withHandlers({
        expandPanel: ({ updateExpanded, edited, updateEdited }) => (panel) => (ev, expanded) => {
            if (edited === panel) {
                updateExpanded(panel);
            } else {
                if (edited)
                    updateEdited(null);
                updateExpanded(expanded ? panel : false);

            }
        },
        setApplyToJob: props => async (isApplying) => {
            let {
                handleApplyToJob, match
            } = props;

            try {
                await handleApplyToJob({
                    variables: {
                        jobId: match.params.jobId,
                        isApplying
                    },
                    refetchQueries: [{
                        query: getJobQuery,
                        fetchPolicy: 'network-only',
                        name: 'getJobQuery',
                        variables: {
                            id: match.params.jobId,
                            language: match.params.lang
                        }
                    }, {
                        query: currentProfileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfile',
                        variables: {
                            language: match.params.lang,
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

const Show = props => {
    const {
        getJobQuery: { loading: jobLoading, job },
        currentProfile: { loading: currentProfileLoading, profile }
    } = props;

    if (jobLoading || currentProfileLoading) {
        return <Loader />
    } else if (!job) {
        //TODO
        return <div>Job not found...</div>;
    } else {
        const { expanded, expandPanel, setApplyToJob } = props;
        const { i18n, company: { name: companyName, i18n: companyText, faqs, officeArticles, jobs }, expireDate, createdAt/*, videos, images*/ } = job;
        // TODO: appliedDate, jobLevel, benefits from props
        // const appliedDate = new Date(2018, Math.random() * 7, Math.random()*31).toLocaleDateString();
        // const jobLevels = ['entry', 'mid', 'senior'];
        const benefits = [
            {
                icon: 'fas fa-car',
                label: 'Car'
            },
            {
                icon: 'fas fa-mobile-alt',
                label: 'Phone'
            }, {
                icon: 'fas fa-laptop',
                label: 'Laptop'
            }
        ];
        const { title, description, idealCandidate } = i18n[0];
        const { description: companyDescription } = companyText[0];

        let isApplyAllowed = !currentProfileLoading;
        let didApply = false;
        if (isApplyAllowed) {
            const { id: currentUserId } = profile || {};
            didApply = job.applicants.find(u => u.id === currentUserId) !== undefined;
        }

        return (
            <React.Fragment>
                <div className='header'>
                    <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                        <h1 className='jobTitle'>{title}</h1>
                        <div className='jobDetails'>
                            <FormattedDate value={new Date(createdAt)}>
                                {(text) => (<span className='published'>Published&nbsp;{text}</span>)}
                            </FormattedDate>
                            <FormattedDate value={new Date(expireDate)}>
                                {(text) => (<span className='expires'>Expires&nbsp;{text}</span>)}
                            </FormattedDate>
                            <span className='company'>{companyName}</span>
                            {(jobs && jobs.length > 0) &&
                                <span className='availableJobs'>({jobs.length}&nbsp;jobs)</span>
                            }
                        </div>
                        {(isApplyAllowed && profile) ? <Button className={didApply ? "appliedButton" : "applyButton"} onClick={() => setApplyToJob(!didApply)}>
                            {didApply ? "Already applied" : "Apply Now"}
                        </Button> : null}
                    </Grid>
                    <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
                </div>
                <Grid container className='mainBody jobShow'>
                    <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                        <section className='jobDescription'>
                            <h2 className='sectionTitle'>Job <b>description</b></h2>
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: description }} />
                        </section>

                        <section className='jobBenefits'>
                            <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                            {benefits && benefits.map(item => (
                                <span className='benefit' key={item.label}>
                                    <i className={item.icon} />
                                    {item.label}
                                </span>
                            ))}
                        </section>

                        <section className='idealCandidate'>
                            <h2 className='sectionTitle'>Ideal <b>candidate</b></h2>
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: idealCandidate }} />
                        </section>

                        <section className='companyDetails'>
                            <h2 className='sectionTitle'>Company <b>details</b></h2>
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: companyDescription }} />
                        </section>

                        <section className='officeLife'>
                            <ArticleSlider
                                articles={officeArticles || []}
                                title={(<h2 className='sectionTitle'>Office <b>life</b></h2>)}
                            />
                        </section>

                        <section className='qaSection'>
                            <h2 className='sectionTitle'>Q & A</h2>
                            {
                                faqs && faqs.map((item, index) => {
                                    const panelId = 'panel-' + index;
                                    return (
                                        <ExpansionPanel key={item.id} expanded={expanded === panelId} onChange={expandPanel(panelId)} classes={{
                                            root: 'qaPanelRoot'
                                        }}>
                                            <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                                                root: 'qaPanelHeader',
                                                expandIcon: 'qaHeaderIcon',
                                                content: 'qaPanelHeaderContent'
                                            }}>
                                                {item.i18n[0].question}
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                                                {item.i18n[0].answer}
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    )
                                })
                            }
                        </section>

                        <section className='actions'>
                            {isApplyAllowed ? <Button className={didApply ? "appliedButton" : "applyButton"} onClick={() => setApplyToJob(!didApply)}>
                                {didApply ? "Already applied" : "Apply Now"}
                            </Button> : null}
                            <h2 className='sectionTitle'>Share <b>with a friend</b></h2>
                            <div className='socialLinks'>

                                <FacebookShareButton url={window.location.href} quote={title} className='socialLink'>
                                    <i className='fab fa-facebook-f' />
                                </FacebookShareButton>

                                <GooglePlusShareButton url={window.location.href} className='socialLink'>
                                    <i className='fab fa-google-plus-g' />
                                </GooglePlusShareButton>

                                <TwitterShareButton url={window.location.href} title={title} className='socialLink'>
                                    <i className='fab fa-twitter' />
                                </TwitterShareButton>

                                <LinkedinShareButton url={window.location.href} title={title} className='socialLink'>
                                    <i className='fab fa-linkedin-in' />
                                </LinkedinShareButton>

                                <IconButton className='socialLink'>
                                    <i className='fas fa-envelope' />
                                </IconButton>
                            </div>
                        </section>
                    </Grid>
                    <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                        <div className='columnRightContent'>
                            <section className='contactUs'>
                                <h2 className="columnTitle">
                                    Contact <b>us</b>
                                </h2>
                            </section>
                        </div>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
};

export default ShowHOC(Show);