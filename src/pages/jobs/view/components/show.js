import React from 'react';
import { Grid, Button, IconButton, Icon, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import uuid from 'uuidv4';

import ArticleSlider from '../../../../components/articleSlider';

const faq = [
    {
        question: 'What is the question 1?',
        answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.'
    },
    {
        question: 'What is the question 2?',
        answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam.'
    },
    {
        question: 'What is the question 3?',
        answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.Dolore libris nominati te quo, et elit probatus duo.'
    },
    {
        question: 'What is the question 4?',
        answer: 'Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at.'
    }
];

const officeLife = [
    {
        id: uuid(),
        images: [{
            id: uuid(),
            path: 'http://wowslider.com/sliders/demo-11/data/images/krasivyi_korabl_-1024x768.jpg'
        }],
        videos: [{
            id: uuid(),
            path: 'ceva'
        }],
        i18n: [{
            title: 'some title 1',
            description: 'some description'
        }]
    },
    {
        id: uuid(),
        images: [{
            id: uuid(),
            path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwObBmWDaXK4DxechC-rdwErL199LKP6qTC_oIh-5LeoOX-NMC'
        }],
        videos: [{
            id: uuid(),
            path: 'ceva'
        }],
        i18n: [{
            title: 'some titl 22e',
            description: 'some description'
        }]
    },
    {
        id: uuid(),
        images: [{
            id: uuid(),
            path: 'http://ukphotosgallery.com/wp-content/uploads/2016/05/bg3.jpg'
        }],
        videos: [{
            id: uuid(),
            path: 'ceva'
        }],
        i18n: [{
            title: 'some tit411241414le',
            description: 'some descrip2423244ion'
        }]
    },
    {
        id: uuid(),
        images: [{
            id: uuid(),
            path: 'https://www.w3schools.com/howto/img_forest.jpg'
        }],
        videos: [{
            id: uuid(),
            path: 'ceva'
        }],
        i18n: [{
            title: 'some title',
            description: 'some description'
        }]
    },
    {
        id: uuid(),
        images: [{
            id: uuid(),
            path: 'https://www.w3schools.com/howto/img_forest.jpg'
        }],
        videos: [{
            id: uuid(),
            path: 'ceva'
        }],
        i18n: [{
            title: 'some title',
            description: 'some description'
        }]
    }
];

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
    const { expanded, expandPanel } = props;
    return (
        <React.Fragment>
            <div className='header'>
                <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                    <h1 className='jobTitle'>DTP & Web Graphic <b>Designer</b></h1>
                    <p className='jobDetails'>
                        <span className='published'>Published 08 February 2018</span>
                        <span className='expires'>Expires 10 Mar 2018</span>
                        <span className='company'>Vodafone</span>
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
                            Novum quando similique ei sed. Porro convenire scriptorem vim ei, an vim decore prodesset. Quem appetere delicatissimi vis ei, eos stet partem noster at, cu duo mazim utamur intellegebat. Mea no sint choro noluisse, pro duis dissentiet ea. Ea enim numquam nam.
                        </p>
                        <p className='detailedDescription'>
                            Vel equidem accusata et, mazim tritani persius in vel. Ei eos solet perpetua, qui consul vidisse ea. Affert vidisse deseruisse eum et, qui meis democritum argumentum at. Eius illud eleifend ea est. Dico choro referrentur an mei, consulatu repudiare vim no.
                        </p>
                    </section>

                    <section className='jobBenefits'>
                        <h2 className='sectionTitle'>Job <b>benefits</b></h2>
                        <span className='benefit'>
                            <i className='fas fa-car' />
                            Car
                        </span>
                        <span className='benefit'>
                            <i className='fas fa-mobile-alt' />
                            Phone
                        </span>
                        <span className='benefit'>
                            <i className='fas fa-laptop' />
                            Laptop
                        </span>
                    </section>

                    <section className='idealCandidate'>
                        <h2 className='sectionTitle'>Ideal <b>candidate</b></h2>
                        <ul className='candidateTraits'>
                            <li>lorem ipsum dolor sit amet</li>
                            <li>consectetur adipiscing elit, sed do eiusmod tempor</li>
                            <li>incididunt ut labore et dolore magna aliqua</li>
                            <li>minim veniam, quis nostrud exercitation ullamco </li>
                            <li>laboris nisi ut aliquip ex ea commodo consequat</li>
                            <li>duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</li>
                        </ul>
                    </section>

                    <section className='companyDetails'>
                        <h2 className='sectionTitle'>Company <b>details</b></h2>
                        <p>
                            Cu praesent necessitatibus sit, elitr laoreet scribentur et per, qui ne omnium labitur concludaturque. Te ornatus facilisi definitiones sit. Sed ancillae splendide reprehendunt ut, ius an eripuit omittam. Cum quot aliquid intellegat eu. Omnium accumsan detraxit sit an, quodsi virtute cu nec. Pri omnis splendide ad, pro ex legere debitis philosophia.
                        </p>
                    </section>

                    <section className='officeLife'>
                        <ArticleSlider
                            articles={officeLife}
                            title={(<h2 className='sectionTitle'>Office <b>life</b></h2>)}
                        />
                    </section>

                    <section className='qaSection'>
                        <h2 className='sectionTitle'>Q & A</h2>
                        {
                            faq.map((item, index) => {
                                const panelId = 'panel-' + index;
                                return (
                                    <ExpansionPanel expanded={expanded === panelId} onChange={expandPanel(panelId)} classes={{
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
    )
};

export default ShowHOC(Show);