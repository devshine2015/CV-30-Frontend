import React from 'react';
// import { CarouselProvider, DotGroup,  Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { Icon } from '@material-ui/core';
// ************************************** React Alice Carousel ************************** //
import AliceCarousel from 'react-alice-carousel';
import { s3BucketURL } from '../../../../constants/s3';
import ReactPlayer from 'react-player';

import "react-alice-carousel/lib/alice-carousel.css";

import { FormattedDate } from 'react-intl';

import 'pure-react-carousel/dist/react-carousel.es.css';

const JobsSlider = ({ jobs }) => {
    console.log("----------- jobs -------------", jobs)
    const responsive = {
        0: { items: 1 },
        1600: { items: 2 },
      };
    const renderItems = (jobs) => {
        return jobs.map((job, index) => {
            const { id, level, location, expireDate, title, imagePath, videoUrl  } = job;
            return (
                <div index={index} key={id} className='jobItem'>
                    <div className='media'>
                        <div className='mediaFake'>
                            {/* <i className="fas fa-play fa-3x"></i> */}
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
                </div>
            )
        })
    }
    return (
        <div className="jobs">
            {/* <CarouselProvider
                dragEnabled={false}
                visibleSlides={1}
                naturalSlideWidth={400}
                naturalSlideHeight={400}
                totalSlides={jobs.length}
                className="teamSliderMain"
            >
                <div className="groupButtons">
                    <ButtonBack>{"<"}</ButtonBack>
                    <DotGroup />
                    <ButtonNext>{">"}</ButtonNext>
                </div>
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
            </CarouselProvider> */}
            <div className="top-panel">
                <Icon className="left-icon" onClick={() => this.Carousel._slidePrev()}>keyboard_arrow_left</Icon>
                <Icon className="right-icon" onClick={() => this.Carousel._slideNext()}>keyboard_arrow_right</Icon>
            </div>
            <AliceCarousel responsive={responsive} buttonsDisabled={true} ref={ el => this.Carousel = el }>
                {renderItems(jobs)}
            </AliceCarousel>
        </div>
    )
};

export default JobsSlider;
