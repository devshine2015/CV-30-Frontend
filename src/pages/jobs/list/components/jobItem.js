import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, CircularProgress, Chip } from '@material-ui/core';

const JobItem = props => {
    console.log(props);
    const { title, company, expirationDate, location, description, match, videos, images, benefits, jobLevels } = props;
    return (
        <div className='listItem companyListItem'>
            <div className='leftOverlay'>
                <Link to='/dashboard/job'>
                    <Avatar alt="Gabriel" src="http://brandmark.io/logo-rank/random/pepsi.png" className='avatar' />
                </Link>
                <div className='leftOverlayTexts'>
                    <h6 className='companyName'>
                        {company}
                    </h6>
                    <p className='expires'>Expires on: <span>{expirationDate}</span></p>
                </div>
            </div>
            <div className='rightOverlay'>
                <div className='location'>
                    <i className='fas fa-lg fa-map-marker-alt' />
                    {location}
                </div>
                <div className='match'>
                    <CircularProgress
                        variant='static'
                        size={80}
                        value={match}
                        classes={{
                            root: 'matchRoot'
                        }}
                    />
                    <span className='matchValue'>
                        {match}%
                        <br />
                        <span className='matchText'>
                            match
                        </span>
                    </span>
                </div>
            </div>
            <div className='itemBody'>
                {
                    ((videos && videos.length) || (images && images.length)) &&
                    <div className='media'>

                    </div>
                }
                <div className='details'>
                    <h2 className='jobTitle'>{title}</h2>
                    <div className='levels'>
                        {jobLevels && jobLevels.map(item => <Chip className='jobLevel' label={item} key={item} />)}
                    </div>
                    <div className='benefits'>
                        {benefits && benefits.map(item => (
                            <div className='benefit'>
                                <i className={item.icon} />
                                {item.label}
                            </div>
                        ))}
                    </div>
                    <p className='companyDescription'>
                        {description}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default JobItem;