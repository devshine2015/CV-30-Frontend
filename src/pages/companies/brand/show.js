import React from 'react';
import { Grid, Icon, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Show = ({ expanded, expandPanel }) => {
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
                        <img src='http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg' alt='slider image' />
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

                <section className='moreStories'>
                    <h2 className='titleHeading'>Afla <b>mai multe</b></h2>
                    <div className='story'>
                        <img src='http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg' alt='slider image' />
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
                    <div className='story reverse'>
                        <img src='http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg' alt='slider image' />
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
                    <div className='story'>
                        <img src='http://www.petguide.com/wp-content/uploads/2016/10/yellow-bellied-slider.jpg' alt='slider image' />
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
                    <h2 className='titleHeading'>Q & A</h2>
                    <ExpansionPanel expanded={expanded === 'panel1'} onChange={expandPanel('panel1')} classes={{
                        root: 'qaPanelRoot'
                    }}>
                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                            root: 'qaPanelHeader',
                            expandIcon: 'qaHeaderIcon',
                            content: 'qaPanelHeaderContent'
                        }}>
                            What is the question?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                            Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                            Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel2'} onChange={expandPanel('panel2')} classes={{
                        root: 'qaPanelRoot'
                    }}>
                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                            root: 'qaPanelHeader',
                            expandIcon: 'qaHeaderIcon',
                            content: 'qaPanelHeaderContent'
                        }}>
                            What is the question?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                            Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                            Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel3'} onChange={expandPanel('panel3')} classes={{
                        root: 'qaPanelRoot'
                    }}>
                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                            root: 'qaPanelHeader',
                            expandIcon: 'qaHeaderIcon',
                            content: 'qaPanelHeaderContent'
                        }}>
                            What is the question?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                            Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                            Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel4'} onChange={expandPanel('panel4')} classes={{
                        root: 'qaPanelRoot'
                    }}>
                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                            root: 'qaPanelHeader',
                            expandIcon: 'qaHeaderIcon',
                            content: 'qaPanelHeaderContent'
                        }}>
                            What is the question?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                            Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                            Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={expanded === 'panel5'} onChange={expandPanel('panel5')} classes={{
                        root: 'qaPanelRoot'
                    }}>
                        <ExpansionPanelSummary expandIcon={<Icon>arrow_drop_down_circle</Icon>} classes={{
                            root: 'qaPanelHeader',
                            expandIcon: 'qaHeaderIcon',
                            content: 'qaPanelHeaderContent'
                        }}>
                            What is the question?
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails classes={{ root: 'qaPanelDetailRoot' }}>
                            Nam ne sint nonumy lobortis, docendi recusabo intellegat ut eam. Mel quas mucius tincidunt at. Cu bonorum voluptatum vel, in cum sumo legere blandit.
                            Dolore libris nominati te quo, et elit probatus duo. Eu movet consulatu qui, fuisset forensibus mel ea, detracto legendos quo in.
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </section>

            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <h2 className="columnTitle">
                        Joburi <b>recente</b>
                    </h2>
                </div>
            </Grid>
        </Grid>
    );
}

export default Show;