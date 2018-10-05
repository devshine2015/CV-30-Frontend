import React from 'react';
import { Grid, Button, IconButton, Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Chip } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import ReactPlayer from 'react-player';
import * as benefits from '../../../../assets/benefits';

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
        return <FormattedMessage id="jobs.view.notFound" defaultMessage="Job not found..." description="Job not found">
                    {(text) => (
                        <div>{text}</div>
                    )}
                </FormattedMessage>
        

    } else {
        const { expanded, expandPanel, setApplyToJob } = props;
        const { title, description, idealCandidate, company: { name: companyName, description: companyDescription, faqs, officeArticles, jobs },
            expireDate, createdAt, activityField, salary, skills, jobTypes, videoUrl, imagePath, jobBenefits,
            phone, email, facebook, linkedin
        } = job;

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
                            <FormattedMessage id="jobs.new.descriptions" defaultMessage="Job \ndescription" description="Job description">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: description }} />
                        </section>

                        <section className='jobBenefits'>
                            <FormattedMessage id="jobs.new.jobBenefits" defaultMessage="Job \nbenefits" description="Job benefits">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            
                            {jobBenefits && jobBenefits.map(item => (
                                <FormattedMessage id={`benefits.${item.key}`} defaultMessage={item.key} key={item.key}>
                                    {(text) => (
                                        <span className='benefit'>
                                            <img style={{ marginRight: '10px', width: '20px' }} src={benefits[item.key.replace(/\b-([a-z])/g, function(all, char) { return char.toUpperCase() })]} alt={item.key} />
                                            {text}
                                        </span>
                                    )}
                                </FormattedMessage>
                            ))}
                        </section>

                        <section className='idealCandidate'>
                            <FormattedMessage id="jobs.new.idealCandidate" defaultMessage="Ideal \ncandidate" description="Ideal candidate">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: idealCandidate }} />
                        </section>

                        {activityField &&
                            <section className='activityType'>
                                <FormattedMessage id="jobs.new.activity" defaultMessage="Activity \nfield" description="Activity field">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                <p className='detailedDescription'>{activityField.title}</p>
                            </section>
                        }
                        {skills &&
                            <section className='skills'>
                                <FormattedMessage id="jobs.new.desirableSkills" defaultMessage="Desirable \nskills" description="Desirable skills">
                                    {(text) => (    
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                {skills && skills.map(item =>
                                    <FormattedMessage id={`skills.${item.key}`} defaultMessage={item.key} key={item.key}>
                                         {text => (
                                            <Chip
                                                label={text}
                                                className='chip'
                                                clickable={false}
                                            />
                                        )}
                                    </FormattedMessage>
                                )}
                            </section>
                        }
                        <section className='jobType'>
                            <FormattedMessage id="jobs.new.jobTypes" defaultMessage="Job \ntype" description="Job type">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            {jobTypes && jobTypes.map(item => (
                                <Chip
                                    key={item.id}
                                    label={item.title}
                                    className='chip'
                                    clickable={false}
                                />
                            ))}
                        </section>

                        {/* TODO: show only if user owns the job or don't show at all?! */}
                        {(salary && salary.isPublic) &&
                            <section className='salary'>
                                <FormattedMessage id="jobs.new.salaryRange" defaultMessage="Salary \nrange" description="Salary range">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                <p>{`${salary.amountMin} - ${salary.amountMax} ${formatCurrency(salary.currency)}`}</p>
                            </section>}

                        {companyDescription &&
                            <section className='companyDetails'>
                                <FormattedMessage id="jobs.view.companyDetails" defaultMessage="Company \ndetails" description="Company details">
                                    {(text) => (
                                        <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                    )}
                                </FormattedMessage>
                                
                                <p className='detailedDescription' dangerouslySetInnerHTML={{ __html: companyDescription }} />
                            </section>
                        }
                        {officeArticles &&
                            <section className='officeLife'>
                                <FormattedMessage id="jobs.view.officeLife" defaultMessage="Office \nlife" description="Office life">
                                    {(text) => (
                                        <ArticleSlider
                                            articles={officeArticles || []}
                                            title={(<h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>)}
                                        />
                                    )}
                                </FormattedMessage>
                                
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
                                                    {item.question}
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                                                    {item.answer}
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
                            <FormattedMessage id="jobs.view.shareWith" defaultMessage="Share \nwith a friend" description="Share with a friend">
                                {(text) => (
                                    <h2 className='sectionTitle'>{text.split("\n")[0]} <b>{text.split("\n")[1]}</b></h2>
                                )}
                            </FormattedMessage>
                            
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
                                    <FormattedMessage id="jobs.view.contactUs" defaultMessage="Contact \nus" description="Contact us">
                                        {(text) => (
                                            <h2 className="columnTitle">
                                                {text.split("\n")[0]} <b>{text.split("\n")[1]}</b>
                                            </h2>
                                        )}
                                    </FormattedMessage>
                                    
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
                                            <a href={facebook} target="_blank" rel="noopener noreferrer">{facebook}</a>
                                        </div>
                                    }
                                    {linkedin &&
                                        <div className='contactField'>
                                            <i className='fab fa-lg fa-linkedin-in' />
                                            <a href={linkedin} target="_blank" rel="noopener noreferrer">{linkedin}</a>
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