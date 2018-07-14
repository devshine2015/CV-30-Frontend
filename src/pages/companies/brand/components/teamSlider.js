import React from 'react';
// import Slider from "react-flex-carousel";
import { Link } from 'react-router-dom';
import { compose, withState, withHandlers, pure } from 'recompose';

const TeamSliderHOC = compose(
    withState(),
    withHandlers(),
    // lifecycle(),
    pure
)

const TeamSlider = props => {
    const { teams, match: { params: { lang } } } = props;
    return (
        <div className='slidesContainer'>
            {teams.map(team => {
                let url = `/${lang}/dashboard/team/${team.id}`;
                return (
                    <Link to={url} className='teamSliderItem' key={team.id}>
                        <img src='https://www.projecttimes.com/media/k2/items/cache/6612da61425d98755836902a8bde1bce_XL.jpg' alt="ceva" className='teamImg' />
                        <span className='teamText'>{team.name}</span>
                    </Link>
                )
            })}
        </div>
    );
}

export default TeamSliderHOC(TeamSlider);