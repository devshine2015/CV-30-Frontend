import React from 'react';
import { Grid, Avatar, Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

const jobs = [
    {
        id: 'job-1',
        title: 'Some job title',
        date: '11-12-2018',
        level: 'entry'
    },
    {
        id: 'job-2',
        title: 'Some job title',
        date: '11-12-2018',
        level: 'entry'
    },
    {
        id: 'job-3',
        title: 'Some job title',
        date: '11-12-2018',
        level: 'entry'
    },
    {
        id: 'job-4',
        title: 'Some job title',
        date: '11-12-2018',
        level: 'entry'
    },
    {
        id: 'job-5',
        title: 'Some job title',
        date: '11-12-2018',
        level: 'entry'
    }
];

const Show = props => {
    const { match } = props;
    const lang = match.params.lang;
    return (
        <Grid container className='mainBody teamShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <section className='teamMembers'>
                    <h2 className='titleHeading'>Membrii<b>echipei</b></h2>
                    <div className='teamMembersContainer'>
                        <div className='teamMember'>
                            <Avatar src='https://bootdey.com/img/Content/avatar/avatar6.png' alt='teamMember' className='avatar' />
                            <span className='teamMemberName'>John Doe</span>
                            <i className='fas fa-check-circle' />
                        </div>
                        <div className='teamMember'>
                            <Avatar src='https://bootdey.com/img/Content/avatar/avatar6.png' alt='teamMember' className='avatar' />
                            <span className='teamMemberName'>John Doe</span>
                            <i className='fas fa-check-circle' />
                        </div>
                        <div className='teamMember'>
                            <Avatar src='https://bootdey.com/img/Content/avatar/avatar6.png' alt='teamMember' className='avatar' />
                            <span className='teamMemberName'>John Doe</span>
                            <i className='fas fa-check-circle' />
                        </div>
                        <div className='teamMember'>
                            <Avatar src='https://bootdey.com/img/Content/avatar/avatar6.png' alt='teamMember' className='avatar' />
                            <span className='teamMemberName'>John Doe</span>
                            <i className='fas fa-check-circle' />
                        </div>
                    </div>
                </section>
                <section className='teamLife'>
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
                </section>
                <Link to={`/${lang}/dashboard/companies/`} className='teamBackLink'>Inapoi la Ursus Romania</Link>
            </Grid>
            <Grid item lg={3} md={3} sm={10} xs={11} className='columnRight'>
                <div className='columnRightContent'>
                    <h2 className="columnTitle">
                        <b>Joburile</b> echipei de inovatii
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

export default Show;