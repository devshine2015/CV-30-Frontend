import React from 'react';
import { Grid, IconButton, Icon } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import Slider from '../../hocs/slider';
import { compose, pure, withState } from 'recompose';

const StoriesSlider = props => {
    const { classes, stories, prevItem, nextItem, jumpToItem, activeItem } = props;
    if (!stories)
        return null;
    return (
        <Grid container>
            <Grid item md={6} sm={6} xs={12} className={classes.storiesSliderContainer}>
                <FormattedMessage id="landingPage.storiesHeadline" defaultMessage="User stories" description="Stories headline on app landing page">
                    {(text) => (<h1 className={classes.storiesSliderTitle}>{text}</h1>)}
                </FormattedMessage>
                <div className={classes.sliderControls}>
                    <IconButton className={classes.sliderArrow} onClick={prevItem}>
                        <Icon>arrow_back_ios</Icon>
                    </IconButton>
                    {
                        stories.map((item, index) => {
                            let itemClass = index === activeItem ? [classes.sliderDot, classes.sliderDotActive].join(' ') : classes.sliderDot;
                            return (<span className={itemClass} key={`storyMarker-${index}`} onClick={() => jumpToItem(index)}></span>)
                        })
                    }
                    <IconButton className={classes.sliderArrow} onClick={nextItem}>
                        <Icon>arrow_forward_ios</Icon>
                    </IconButton>
                </div>
                {stories.map((story, index) => {
                    let itemClass = index === activeItem ? [classes.storyItem, classes.storyItemActive].join(' ') : classes.storyItem;
                    return (
                        <div className={itemClass} key={`storyItem-${index}`}>
                            <h2 className={classes.slideTitle}>{story.title}</h2>
                            <p className={classes.slideText}>{story.text}</p>
                        </div>
                    )
                })}
            </Grid>
            <Grid item md={6} sm={6} xs={12} className={classes.storiesImagesContainer}>
                {stories.map((story, index) => {
                    let itemClass = index === activeItem ? [classes.slideImage, classes.slideImageActive].join(' ') : classes.slideImage;
                    return <img className={itemClass} src={story.image} alt={`storyImage-${index}`} key={`storyImage-${index}`} />
                })}
            </Grid>
        </Grid>
    )
};

export default compose(
    withState('count', 'setCount', ({ stories }) => (stories.length - 1)),
    Slider,
    pure
)(StoriesSlider);