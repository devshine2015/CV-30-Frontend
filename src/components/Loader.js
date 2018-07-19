import React from 'react';

const Loader = () => (
    <div className='loaderRoot'>
        <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
            <div className="rect4"></div>
            <div className="rect3"></div>
            <div className="rect2"></div>
            <div className="rect1"></div>
        </div>
        <p className='message'>Loading data...</p>
    </div>
);

export default Loader;