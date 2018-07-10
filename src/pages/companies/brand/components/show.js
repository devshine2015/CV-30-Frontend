import React from 'react';
import { Grid, Icon, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import SliderHOC from '../../../../hocs/slider';
import uuid from 'uuidv4';

import AddNewStory from './addStory';
import QuestionEdit from './questionEdit';
import Story from './story';
import ArticleSlider from '../../../../components/articleSlider';




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


const Show = (props) => {
    const { expanded, expandPanel, editMode, companyQuery: { company: { faqs, storiesArticles, jobs } }, edited, editPanel } = props;
    // const { faq, moreStories, jobs } = co;
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
                    <ArticleSlider
                        articles={officeLife}
                        title={(<h2 className='titleHeading'>Viata <b>la birou</b></h2>)}
                    />
                    {editMode && <AddNewStory />}
                </section>

                <section className='moreStories'>
                    <h2 className='titleHeading'>Afla <b>mai multe</b></h2>
                    {
                        storiesArticles.map((story, index) => (
                            <Story story={story} index={index} editMode={editMode} key={`story-${index}`} />
                        ))
                    }
                    {editMode && <AddNewStory />}
                </section>

                <section className='qaSection'>
                    <h2 className='titleHeading'>Q &amp; A</h2>
                    {
                        faqs.map((item, index) => {

                            const panelId = 'panel-' + index;
                            if (edited !== panelId)
                                return (
                                    <ExpansionPanel
                                        expanded={expanded === panelId}
                                        onChange={expandPanel(panelId)}
                                        classes={{
                                            root: 'qaPanelRoot'
                                        }}
                                        key={`QAitem-${index}`}
                                    >
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
    withState('count', null, officeLife.length - 1),
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