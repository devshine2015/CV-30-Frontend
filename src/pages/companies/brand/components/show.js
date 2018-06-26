import React from 'react';
import { Grid, Icon, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import SliderHOC from '../../../../hocs/slider';

import AddNewStory from './addStory';
import QuestionEdit from './questionEdit';
import Story from './story';



const Show = (props) => {
    const { expanded, expandPanel, editMode, data, edited, editPanel } = props;
    const { faq, moreStories, jobs } = data;
    return (
        <Grid container className='mainBody brandShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='aboutSection'>
                    <h2 className='titleHeading'>Despre <b>Ursus Romania</b></h2>
                    <p>
                        Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                        Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        Ex dicunt accusata adversarium vis, est an illum aliquam scriptorem, est no noster sanctus eleifend.
                    </p>
                </section>

                <section className='officeLife'>
                    <div className='sliderHeader'>
                        <h2 className='titleHeading'>Viata <b>la birou</b></h2>
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

                    {editMode && <AddNewStory />}
                </section>

                <section className='moreStories'>
                    <h2 className='titleHeading'>Afla <b>mai multe</b></h2>
                    {
                        moreStories.map((story, index) => (
                            <Story story={story} index={index} editMode={editMode} />
                        ))
                    }
                    {editMode && <AddNewStory />}
                </section>

                <section className='qaSection'>
                    <h2 className='titleHeading'>Q & A</h2>
                    {
                        faq.map((item, index) => {

                            const panelId = 'panel-' + index;
                            if (edited !== panelId)
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
                                            {editMode &&
                                                <IconButton onClick={(e) => editPanel(e, panelId)} className='editBtn'>
                                                    <Icon>edit</Icon>
                                                </IconButton>
                                            }
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                                            {item.answer}
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                )
                            else
                                return <QuestionEdit question={item} onChange={expandPanel} expanded={expanded} panelId={panelId} />
                        })
                    }
                </section>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <h2 className="columnTitle">
                        <b>Joburi</b> recente
                    </h2>

                    <div className='jobs'>
                        {
                            jobs.map((job, index) => {
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
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

const ShowHOC = compose(
    withState('expanded', 'updateExpanded', null),
    withState('edited', 'updateEdited', null),
    withState('editedStory', 'editStory', null),
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
        editPanel: ({ updateEdited, updateExpanded, edited }) => (e, panel) => {
            updateEdited(panel || false);
            if (panel !== edited) {
                updateExpanded(panel);
                e.stopPropagation();
            }
        }
    }),
    SliderHOC,
    pure
)

export default ShowHOC(Show);