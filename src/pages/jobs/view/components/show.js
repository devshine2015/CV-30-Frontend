import React from 'react';
import { Grid, Button, IconButton, Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Chip } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import ReactPlayer from 'react-player';

import ArticleSlider from '../../../../components/articleSlider';
import Loader from '../../../../components/Loader';
import { handleApplyToJob } from '../../../../store/queries';
import { currentProfileRefetch, jobRefetch } from '../../../../store/refetch';
import { formatCurrency } from '../../../../constants/utils';
import { s3BucketURL } from '../../../../constants/s3';

const ShowHOC = compose(

    graphql(handleApplyToJob, { name: 'handleApplyToJob' }),
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
                    refetchQueries: [
                        jobRefetch(match.params.jobId, match.params.lang),
                        currentProfileRefetch(match.params.lang)
                    ]
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
        currentUser: { auth: { currentUser } }
    } = props;

    if (jobLoading) {
        return <Loader />

    } else if (!job) {
        //TODO
        return <div>Job not found...</div>;

    } else {
        const { expanded, expandPanel, setApplyToJob } = props;
        const { i18n, company: { name: companyName, i18n: companyText, faqs, officeArticles, jobs },
            expireDate, createdAt, activityField, salary, skills, jobTypes, videoUrl, imagePath, jobBenefits,
            phone, email, facebook, linkedin
        } = job;

        const { title, description, idealCandidate } = i18n[0];
        const { description: companyDescription } = companyText[0];

        let isApplyAllowed = !!currentUser;
        let didApply = false;
        if (isApplyAllowed) {
            const { id: currentUserId } = currentUser || {};
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
                        {isApplyAllowed ? <Button className={didApply ? "appliedButton" : "applyButton"} onClick={() => setApplyToJob(!didApply)}>
                            {didApply ? "Already applied" : "Apply Now"}
                        </Button> : null}
                    </Grid>
                    <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
                </div>
                <Grid container className='mainBody jobShow'>
                    <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                        {(imagePath || videoUrl) &&
                            <section className='media'>
                                {imagePath &&
                                    <img src={`${s3BucketURL}${imagePath}`} alt={title} className='jobImage' />
                                }
                                {(videoUrl && !imagePath) &&
                                    <ReactPlayer
                                        url={videoUrl}
                                        width='100%'
                                        height='100%'
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
                                        playing={false} />
                                }
                            </section>
                        }
                        <section className='jobDescription'>
                            <h2 className='sectionTitle'>Job <b>description</b></h2>
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: description }} />
                        </section>

                        <section className='jobBenefits'>
                            <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                            {jobBenefits && jobBenefits.map(item => (
                                <FormattedMessage id={`benefits.${item.key}`} defaultMessage={item.key} key={item.key}>
                                    {(text) => (
                                        <span className='benefit'>
                                            <i className={item.icon} />
                                            {text}
                                        </span>
                                    )}
                                </FormattedMessage>
                            ))}
                        </section>

                        <section className='idealCandidate'>
                            <h2 className='sectionTitle'>Ideal <b>candidate</b></h2>
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: idealCandidate }} />
                        </section>

                        {activityField &&
                            <section className='activityType'>
                                <h2 className='sectionTitle'>Activity <b>field</b></h2>
                                <p className='detailedDescription'>{activityField.i18n[0].title}</p>
                            </section>
                        }
                        {skills &&
                            <section className='skills'>
                                <h2 className='sectionTitle'>Desirable <b>skills</b></h2>
                                {skills && skills.map(item =>
                                    <Chip
                                        key={item.id}
                                        label={item.i18n[0].title}
                                        className='chip'
                                        clickable={false}
                                    />
                                )}
                            </section>
                        }
                        <section className='jobType'>
                            <h2 className='sectionTitle'>Job <b>type</b></h2>
                            {jobTypes && jobTypes.map(item => (
                                <Chip
                                    key={item.id}
                                    label={item.i18n[0].title}
                                    className='chip'
                                    clickable={false}
                                />
                            ))}
                        </section>

                        {/* TODO: show only if user owns the job or don't show at all?! */}
                        {(salary && salary.isPublic) &&
                            <section className='salary'>
                                <h2 className='sectionTitle'>Salary <b>range</b></h2>
                                <p>{`${salary.amountMin} - ${salary.amountMax} ${formatCurrency(salary.currency)}`}</p>
                            </section>}

                        {companyDescription &&
                            <section className='companyDetails'>
                                <h2 className='sectionTitle'>Company <b>details</b></h2>
                                <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: companyDescription }} />
                            </section>
                        }
                        {officeArticles &&
                            <section className='officeLife'>
                                <ArticleSlider
                                    articles={officeArticles || []}
                                    title={(<h2 className='sectionTitle'>Office <b>life</b></h2>)}
                                />
                            </section>
                        }
                        {(faqs && faqs.length > 0) &&
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
                        }
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
                            <div className='fixed'>
                                <section className='contactUs'>
                                    <h2 className="columnTitle">
                                        Contact <b>us</b>
                                    </h2>
                                    {phone &&
                                        <div className='contactField'>
                                            <i className='fas fa-lg fa-phone' />
                                            <span>{phone}</span>
                                        </div>
                                    }
                                    {email &&
                                        <div className='contactField'>
                                            <i className='fas fa-envelope fa-lg' />
                                            <a href={`mailto: ${email}`}>{email}</a>
                                        </div>
                                    }
                                    {facebook &&
                                        <div className='contactField'>
                                            <i className='fab fa-lg fa-facebook' />
                                            <a href={facebook} target="_blank">{facebook}</a>
                                        </div>
                                    }
                                    {linkedin &&
                                        <div className='contactField'>
                                            <i className='fab fa-lg fa-linkedin-in' />
                                            <a href={linkedin} target="_blank">{linkedin}</a>
                                        </div>
                                    }
                                </section>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
};

export default ShowHOC(Show);