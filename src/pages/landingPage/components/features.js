import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Grid, Avatar } from '@material-ui/core';
import ReactPlayer from 'react-player';

const FeaturesHOC = compose(
    withState(),
    withHandlers(),
    pure
);

const Features = props => {
    const { stories, editMode } = props;
    return (
        <div className='featuresContainer'>
            {stories && stories.map((story, index) => {
                let { id, images, videos, i18n } = story;
                let image, video;
                if (story.images && story.images.length > 0) {
                    // image = `${s3BucketURL}${story.images[0].path}`; //used for REAL articles :)
                    image = story.images[0].path;
                }
                if (story.videos && story.videos.length > 0) {
                    video = story.videos[0].path;
                }
                return (
                    <Grid container className={index % 2 === 0 ? 'featureRow' : 'featureRow featureRowReverse'} key={id}>
                        <Grid item md={5} sm={12} xs={12} className='featureImageContainer'>
                            <div className='featureImage'>
                                {image &&
                                    <img src={image} alt={story.id} className='articleImg' />
                                }
                                {(video && !image) &&
                                    <ReactPlayer
                                        url={video}
                                        width='100%'
                                        height='100%'
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
                                }
                            </div>
                        </Grid>

                        <Grid item md={5} sm={11} xs={11} className='featureTexts'>
                            <h2 className='featureHeading'>{i18n[0].title}</h2>
                            <p className='featureText'>{i18n[0].description}</p>
                        </Grid>
                    </Grid>
                )
            })}
            {
                editMode &&
                <div className='addFeaturedArticle'>
                    + Add Story
                </div>
            }
        </div>

    );
}

export default FeaturesHOC(Features);