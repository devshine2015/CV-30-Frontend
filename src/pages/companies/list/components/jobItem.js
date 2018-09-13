import React from 'react';

const JobItem = ({ id, level, location, title, date }) => (
    <div className='jobItem' key={id}>
        <div className='media'>
            <div className='mediaFake'>
                <i className="fas fa-play fa-3x"></i>
            </div>
            <span className='role'>{level}</span>
        </div>
        <div className='info'>
            <h5>{title}</h5>
            <span>{date} - {location}</span>
        </div>
    </div>
);

export default JobItem;