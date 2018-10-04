import React from 'react';
import { FormattedMessage } from 'react-intl'

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
        <FormattedMessage id="loader.data" defaultMessage="Loading data..." description="Loading data">
            {(text) => (
                <p className='message'>{text}</p>
            )}
        </FormattedMessage>
        
    </div>
);

export default Loader;