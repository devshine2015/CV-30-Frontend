import React from 'react';
import { Link } from 'react-router-dom';
import { compose, withState, withHandlers, pure } from 'recompose';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const TeamSliderHOC = compose(
    withState(),
    withHandlers(),
    pure
)

const TeamSlider = props => {
    const { teams, match: { params: { lang } } } = props;

    return <CarouselProvider
        dragEnabled={false}
        visibleSlides={2} // dinamyc
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={teams.length}
        className="teamSliderMain"
    >
        <Slider className="slidesContainer" classNameTrayWrap="slidesContainer">
            {teams.map((team, index) => {
                let url = `/${lang}/dashboard/team/${team.id}`;
                return (
                    <Slide index={index} key={index}>
                        <Link to={url} className='teamSliderItem' key={team.id}>
                            <img src='https://www.projecttimes.com/media/k2/items/cache/6612da61425d98755836902a8bde1bce_XL.jpg' alt="ceva" className='teamImg' />
                            <span className='teamText'>{team.name}</span>
                        </Link>
                    </Slide>
                );
            })}
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
    </CarouselProvider>;
}

export default TeamSliderHOC(TeamSlider);