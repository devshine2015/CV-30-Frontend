import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, CircularProgress, Chip } from '@material-ui/core';
import { defaultCompanyLogo } from '../../../../constants/utils';
import {compose}from 'recompose';
import { withRouter } from 'react-router-dom';

const JobItem = props => {
    const { i18n, company: { name: companyName, location }, expireDate, videos, images, id, match, appliedDate, jobLevels, benefits } = props;
    const { title, description } = i18n[0];

    return (
        <div className='listItem jobListItem'>
            <div className='leftOverlay'>
                <Link to={`/${props.match.params.lang}/job/${id}`}>
                    <Avatar alt="Gabriel" src={defaultCompanyLogo} className='avatar' style={{ margin: 3, backgroundColor: '#fff' }} imgProps={{ style: { objectFit: 'contain' } }} />
                </Link>
                <div className='leftOverlayTexts'>
                    <h6 className='companyName'>
                        {companyName}
                    </h6>
                    <p className='expires'>Expires on: <span>{new Date(expireDate).toLocaleDateString()}</span></p>
                </div>
            </div>
            <div className='rightOverlay'>
                <div className='location'>
                    <i className='fas fa-lg fa-map-marker-alt' />
                    {location}
                </div>
                {/*                
                <div className='match'>
                    <CircularProgress
                        variant='static'
                        size={80}
                        value={match || 0}
                        classes={{
                            root: 'matchRoot'
                        }}
                    />
                    <span className='matchValue'>
                        {match?match.toFixed(0):0}%
                        <br />
                        <span className='matchText'>
                            match
                        </span>
                    </span>
                </div>       
                */}
            </div>
            {
                appliedDate &&
                <span className='appliedDate'>Applied:&nbsp;<b>{appliedDate}</b></span>
            }
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
                            <div className='benefit' key={item.label}>
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

export default compose(withRouter)(JobItem);