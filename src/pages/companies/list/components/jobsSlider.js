import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { Icon } from '@material-ui/core';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FormattedDate } from 'react-intl';

const JobsSlider = ({ jobs }) => {
    return (
        <div className="jobs">

            <CarouselProvider
                // dragEnabled={false}
                visibleSlides={2}
                naturalSlideWidth={400}
                naturalSlideHeight={200}
                totalSlides={jobs.length}
                className="teamSliderMain"
            >
                <Slider
                    className="slidesContainer"
                    classNameTrayWrap="slidesContainer"
                >
                    {jobs.map((job, index) => {
                        const { id, level, location, expireDate, title } = job;
                        return (
                            <Slide index={index} key={id}
                                className='jobItem'
                            >

                                <div className='media'>
                                    <div className='mediaFake'>
                                        <i className="fas fa-play fa-3x"></i>
                                    </div>
                                    <span className='role'>{level}</span>
                                </div>
                                <div className='info'>
                                    <h5>{title}</h5>
                                    <FormattedDate value={expireDate} month='short' day='2-digit'                >
                                        {(text) => (<span>{text}</span>)}
                                    </FormattedDate>
                                    <span>&nbsp;-&nbsp;{location}</span>
                                </div>

                            </Slide>
                        )
                    })}
                </Slider>
            </CarouselProvider>
        </div>
    )
};

export default JobsSlider;
