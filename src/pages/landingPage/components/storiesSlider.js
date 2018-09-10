import React from 'react';
import { Grid, IconButton, Icon } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, withState } from 'recompose';
import ReactPlayer from 'react-player';

import Slider from '../../../hocs/slider';

const StoriesSlider = props => {
    const { stories, prevItem, nextItem, jumpToItem, activeItem } = props;
    if (!stories)
        return null;
    return (
        <Grid container className='storiesContainer'>
            <Grid item md={6} sm={6} xs={12} className='storiesSliderContainer'>
                <FormattedMessage id="landingPage.storiesHeadline" defaultMessage="User stories" description="Stories headline on app landing page">
                    {(text) => (<h1 className='storiesSliderTitle'>{text}</h1>)}
                </FormattedMessage>
                <div className='sliderControls'>
                    <IconButton className='sliderArrow' onClick={prevItem}>
                        <Icon>arrow_back_ios</Icon>
                    </IconButton>
                    {
                        stories.map((item, index) => {
                            let itemClass = index === activeItem ? 'sliderDot sliderDotActive' : 'sliderDot';
                            return (<span className={itemClass} key={item.id} onClick={() => jumpToItem(index)}></span>)
                        })
                    }
                    <IconButton className='sliderArrow' onClick={nextItem}>
                        <Icon>arrow_forward_ios</Icon>
                    </IconButton>
                </div>
                {stories.map((story, index) => {
                    let itemClass = index === activeItem ? 'storyItem storyItemActive' : 'storyItem';
                    return (
                        <div className={itemClass} key={story.id}>
                            <h2 className='slideTitle'>{story.title}</h2>
                            <p className='slideText'>{story.description}</p>
                        </div>
                    )
                })}
            </Grid>
            <Grid item md={6} sm={6} xs={12} className='storiesImagesContainer'>
                {stories.map((story, index) => {
                    let itemClass = index === activeItem ? 'slideImage slideImageActive' : 'slideImage';
                    let image, video;
                    if (story.images && story.images.length > 0) {
                        // image = `${s3BucketURL}${story.images[0].path}`;
                        image = story.images[0].path;
                    }
                    if (story.videos && story.videos.length > 0) {
                        video = story.videos[0].path;
                    }

                    if (image)
                        return (<img src={image} alt={story.id} className={itemClass} key={story.id} />)

                    if (video && !image)
                        return (<ReactPlayer
                            key={story.id}
                            url={video}
                            width='100%'
                            height='100%'
                            className={itemClass}
                            config={{
                                youtube: {
                                    playerVars: {
                                        showinfo: 0,
                                        controls: 0,
                                        modestbranding: 1,
                                        loop: 1
                                    }
                                }
                            }}
                            playing={false} />
                        )
                    return null;
                })}
            </Grid>
        </Grid>
    )
};

export default compose(
    withState('count', 'setCount', ({ stories }) => ((stories && stories.length > 0) ? stories.length - 1 : 0)),
    Slider,
    pure
)(StoriesSlider);