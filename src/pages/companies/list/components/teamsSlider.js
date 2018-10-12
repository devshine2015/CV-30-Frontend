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
import testImage from '../../../../assets/download.png'

const responsive = {
    0: { items: 1 },
    1000: { items: 2},
    1800: { items: 3 },
    };
    
class TeamsSlider extends React.Component {
        renderItems = (teams) => {
        return teams.map((team, index) => {
            const { id, coverBackground, coverPath, name } = team
            const style = {
                background: coverPath? `url(${s3BucketURL}${coverPath})` : `${coverBackground}`,
                backgroundSize: 'auto 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }
            return (
                <div key={index} className='team'>
                    <div className='member' style={style}>
                        <p className='name'>{name}</p>
                    </div>
                </div>
            )
        })
    }

    render () {
        const { teams } = this.props
        return (
            <div className="jobs">
                <div className="top-panel">
                    <Icon className="left-icon" onClick={() => this.Carousel._slidePrev()}>keyboard_arrow_left</Icon>
                    <Icon className="right-icon" onClick={() => this.Carousel._slideNext()}>keyboard_arrow_right</Icon>
                </div>
                <AliceCarousel responsive={responsive} buttonsDisabled={true} ref={ el => this.Carousel = el }>
                    {this.renderItems(teams)}
                </AliceCarousel>
            </div>
        )
    }
}
export default TeamsSlider;
