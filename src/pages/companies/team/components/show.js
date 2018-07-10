import React from 'react';
import { Grid, Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import uuid from 'uuidv4';
import ArticleSlider from '../../../../components/articleSlider';

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
                <section className='teamLife'>{officeLife &&
                    <ArticleSlider
                        articles={officeLife}
                        title={(<h2 className='titleHeading'>Viata <b>la birou</b></h2>)}
                    />
                }
                </section>
                <Link to={`/${lang}/dashboard/company/`} className='teamBackLink'>Inapoi la Ursus Romania</Link>
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