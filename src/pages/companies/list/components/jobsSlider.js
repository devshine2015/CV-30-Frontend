import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
// import { Icon } from '@material-ui/core';
import { FormattedDate } from 'react-intl';

import 'pure-react-carousel/dist/react-carousel.es.css';

const JobsSlider = ({ jobs }) => {
    return (
        <div className="jobs">
            <CarouselProvider
                // dragEnabled={false}
                visibleSlides={1}
                naturalSlideWidth={400}
                naturalSlideHeight={200}
                totalSlides={jobs.length}
                className="teamSliderMain"
            >
                <ButtonBack>Back</ButtonBack>
                <ButtonNext>Next</ButtonNext>
                <Slider>
                    {jobs.map((job, index) => {
                        const { id, level, location, expireDate, title } = job;
                        return (
                            <Slide index={index} key={id} className='jobItem'>
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
