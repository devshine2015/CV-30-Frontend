import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { Grid, IconButton, Icon } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { graphql } from 'react-apollo';

import ArticlePopUp from './articlePopUp';
import { s3BucketURL } from '../../../constants/s3';
import { stripHtmlTags } from '../../../constants/utils';
import { setEditMode } from '../../../store/queries';

const FeaturesHOC = compose(
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('articlePopUpOpen', 'setArticlePopUpOpen', false),
    withHandlers({
        toggleArticlePopUp: ({ setArticlePopUpOpen }) => () => {
            setArticlePopUpOpen(true);
        },
        closeArticlePopUp: ({ setArticlePopUpOpen }) => () => {
            setArticlePopUpOpen(false);
        },
        handleEditBtnClick: ({ history, setEditMode, match: { params: { lang } } }) => async id => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/article/${id}`);
        },
    }),
    pure
);

const Features = props => {
    const {
        editMode, isEditAllowed, handleEditBtnClick,
        articlePopUpOpen, toggleArticlePopUp, closeArticlePopUp,
        landingPageQuery: { landingPage }
    } = props;

    const { articles } = landingPage || {};

    return (
        <div className='featuresContainer'>
            {articles && articles.map((article, index) => {
                let { id, images, videos, i18n } = article;
                let image, video;

                if (article.images && article.images.length > 0)
                    image = `${s3BucketURL}${images[0].path}`;

                if (article.videos && article.videos.length > 0)
                    video = videos[0].path;

                return (
                    <Grid container className={index % 2 === 0 ? 'featureRow' : 'featureRow featureRowReverse'} key={id}>

                        <Grid item md={5} sm={12} xs={12} className='featureImageContainer'>
                            <div className='featureImage'>
                                {image &&
                                    <img src={image} alt={id} className='articleImg' />
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
                            <h2 className='featureHeading'>
                                {i18n[0].title}
                                {isEditAllowed &&
                                    <IconButton className='editBtn' onClick={() => handleEditBtnClick(id)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                }
                            </h2>
                            <p className='featureText'>{stripHtmlTags(i18n[0].description)}</p>
                        </Grid>
                    </Grid>
                )
            })}
            {
                editMode &&
                <div className='addFeaturedArticle' onClick={toggleArticlePopUp}>
                    + Add Article
                </div>
            }
            <ArticlePopUp open={articlePopUpOpen} onClose={closeArticlePopUp} />
        </div>

    );
}

export default FeaturesHOC(Features);