import React from 'react';
import { Link } from 'react-router-dom';
import { compose, withState, withHandlers, pure, lifecycle } from 'recompose';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import { Icon } from '@material-ui/core';

import 'pure-react-carousel/dist/react-carousel.es.css';
import { s3BucketURL, teamsFolder } from '../../../../constants/s3';
import { defaultHeaderOverlay } from '../../../../constants/utils';

const TeamSliderHOC = compose(
    withState('state', 'setState', {
        visibleSlides: window.innerWidth < 600 ? 1 : (window.innerWidth < 960 ? 2 : 3),
        slideSize: {
            width: window.innerWidth < 600 ? 240 : 320,
            height: window.innerWidth < 600 ? 150 : 200
        }
    }),
    withHandlers({
        handleResize: ({ state, setState }) => () => setState({
            ...state,
            visibleSlides: window.innerWidth < 600 ? 1 : (window.innerWidth < 960 ? 2 : 3),
            slideSize: {
                width: window.innerWidth < 600 ? 240 : 320,
                height: window.innerWidth < 600 ? 150 : 200
            }
        })
    }),
    lifecycle({
        componentDidMount() {
            const { handleResize } = this.props
            window.addEventListener('resize', handleResize)
        },
        componentWillUnmount() {
            const { handleResize } = this.props
            window.removeEventListener('resize', handleResize)
        }
    }),
    pure
);

const TeamSlider = props => {
    const { teams, match: { params: { lang } }, state: { visibleSlides, slideSize } } = props;

    return <CarouselProvider
        dragEnabled={false}
        visibleSlides={visibleSlides}
        naturalSlideWidth={slideSize.width}
        naturalSlideHeight={slideSize.height}
        totalSlides={teams.length}
        className="teamSliderMain"
    >
        <Slider className="slidesContainer" classNameTrayWrap="slidesContainer">
            {teams.map((team, index) => {
                let { id, name, coverBackground, hasProfileCover, coverContentType } = team;
                let url = `/${lang}/team/${id}`;

                let style = { background: defaultHeaderOverlay };

                if (hasProfileCover) {
                    let newCover = `${s3BucketURL}/${teamsFolder}/${id}/cover.${coverContentType}?${Date.now()}`;
                    style.background = `url(${newCover})`;
                } else if (coverBackground) {
                    style = { background: coverBackground }
                }

                return (
                    <Slide index={index} key={id}>
                        <Link to={url} className='teamSliderItem'>
                            <div className='teamImg' style={style}>
                                <span className='teamText'>{name}</span>
                            </div>
                        </Link>
                    </Slide>
                );
            })}
        </Slider>
        {(teams.length > visibleSlides) &&
            <ButtonBack className='teamSliderBtn back'>
                <Icon>chevron_left</Icon>
            </ButtonBack>
        }
        {(teams.length > visibleSlides) &&
            <ButtonNext className='teamSliderBtn next'>
                <Icon>chevron_right</Icon>
            </ButtonNext>
        }
    </CarouselProvider>;
}

export default TeamSliderHOC(TeamSlider);