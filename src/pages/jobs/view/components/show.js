import React from 'react';
import { Grid, Button, IconButton, Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';

const ShowHOC = compose(
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
        }
    }),
    pure
);

const Show = props => {
    const { loading, job } = props.getJobQuery;
    if (loading) {
        return <div>Loading...</div>
    } else if (!job) {
        //TODO
        return <div>Job not found...</div>;
    } else {
        const { expanded, expandPanel } = props;
        const { i18n, company: { name: companyName, i18n: companyText, faqs }, expireDate, videos, images } =job;
        // TODO: appliedDate, jobLevel, benefits from props
        const appliedDate = new Date(2018, Math.random() * 7, Math.random()*31).toLocaleDateString();
        const jobLevels = ['entry', 'mid', 'senior'];
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
        
        return (
        <React.Fragment>
            <div className='header'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <h1 className='jobTitle'>{title}</h1>
                    <p className='jobDetails'>
                        <span className='published'>Published 08 February 2018</span>
                        <span className='expires'>Expires {expireDate}</span>
                        <span className='company'>{companyName}</span>
                        <span className='availableJobs'>(2 jobs)</span>
                    </p>
                    <Button className='applyButton'>
                        Apply Now
                </Button>
                    <Button className='appliedButton'>
                        Already applied
                </Button>
                </Grid>
                <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'></Grid>
            </div>
            <Grid container className='mainBody jobShow'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <section className='jobDescription'>
                        <h2 className='sectionTitle'>Job <b>description</b></h2>
                        <p className='shortDescription'>
                            {description}
                        </p>
                        <p className='detailedDescription'>
                            {description}
                        </p>
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
                        <ul className='candidateTraits'>
                            {idealCandidate}
                        </ul>
                    </section>

                    <section className='companyDetails'>
                        <h2 className='sectionTitle'>Company <b>details</b></h2>
                        <p>
                            {companyDescription}
                        </p>
                    </section>

                    <section className='officeLife'>
                        <div className='sliderHeader'>
                            <h2 className='sectionTitle'>Office <b>life</b></h2>
                            <div className='sliderControls'>
                                <IconButton className='sliderArrow'>
                                    <Icon>
                                        arrow_back_ios
                                    </Icon>
                                </IconButton>

                                <span className='sliderDot'></span>
                                <span className='sliderDot'></span>
                                <span className='sliderDot active'></span>
                                <span className='sliderDot'></span>
                                <span className='sliderDot'></span>

                                <IconButton className='sliderArrow'>
                                    <Icon>
                                        arrow_forward_ios
                                    </Icon>
                                </IconButton>
                            </div>
                        </div>
                        <div className='sliderContents'>
                            <img src='http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg' alt='slider bla' />
                            <div className='textContents'>
                                <h4>
                                    Slide title
                            </h4>
                                <p>
                                    Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                                        Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        </p>
                            </div>
                        </div>
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
                        <Button className='applyButton'>
                            Apply now
                        </Button>
                        <h2 className='sectionTitle'>Share <b>with a friend</b></h2>
                        <div className='socialLinks'>
                            <IconButton className='socialLink'>
                                <i className='fab fa-facebook-f' />
                            </IconButton>
                            <IconButton className='socialLink'>
                                <i className='fab fa-google-plus-g' />
                            </IconButton>
                            <IconButton className='socialLink'>
                                <i className='fab fa-twitter' />
                            </IconButton>
                            <IconButton className='socialLink'>
                                <i className='fab fa-linkedin-in' />
                            </IconButton>
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
    )}
};

export default ShowHOC(Show);