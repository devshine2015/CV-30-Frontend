import React from 'react';
import Header from './components/header';
import StoriesSlider from './components/storiesSlider';
import Features from './components/features';
import Footer from './components/footer';
import Loader from '../../components/Loader';

const LandingPage = props => {
    const { currentUserQuery, landingPageQuery } = props;

    if (!currentUserQuery.auth || !landingPageQuery.landingPage)
        return <Loader />

    return (
        <div id="landingPage" className='landingPageRoot'>
            <Header {...props} />
            <Features {...props} />
            <StoriesSlider {...props} />
            <Footer {...props} />
        </div>
    );
}

export default LandingPage;