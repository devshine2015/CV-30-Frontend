import React from 'react';
import { Grid } from '@material-ui/core';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';

import { s3BucketURL } from '../constants/s3';
import { getArticles, handleArticle, currentUserQuery } from '../store/queries';

const ArticleBrowserHOC = compose(
    withRouter,
    graphql(getArticles, {
        name: 'getArticles',
        options: (props) => ({
            variables: {
                language: props.match.params.lang
            },
            fetchPolicy: 'network-only',
        }),
    }),
    graphql(handleArticle, { name: 'handleArticle' }),
    withHandlers({
        updateArticle: props => async articleId => {
            const { match, type, handleArticle } = props;

            let article = {
                id: articleId
            };
            let options = {};

            switch (type) {
                case 'profile_isFeatured':
                    article.isFeatured = true;
                    break;
                case 'profile_isAboutMe':
                    article.isAboutMe = true;
            }

            try {
                await handleArticle({
                    variables: {
                        article,
                        options,
                        language: match.params.lang
                    },
                    refetchQueries: [{
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en'
                        }
                    }]
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }),
    pure
);

const ArticleBrowser = props => {
    const { articles, loading } = props.getArticles;
    if (loading)
        return (
            <div className='articlesContainer'>
                <p className='noArticles'>Loading...</p>
            </div>
        )

    return (

        <div className='articlesContainer'>
            {
                (articles && articles.length > 0) ? articles.map(article => {
                    let { id, i18n, images, videos } = article;
                    let { title, description } = i18n[0];

                    let image, video;
                    if (images && images.length > 0) {
                        image = `${s3BucketURL}${images[0].path}`;
                    }
                    if (videos && videos.length > 0) {
                        video = videos[0].path;
                    }
                    return (
                        <Grid container className='articleItem' onClick={() => props.updateArticle(id)} key={id}>
                            <Grid item sm={12} md={3} className='articleMedia'>
                                {image &&
                                    <img src={image} alt={id} className='storyImg' />
                                }
                                {(video && !image) &&
                                    <ReactPlayer
                                        url={video}
                                        width='200'
                                        height='140'
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
                            </Grid>
                            <Grid item sm={12} md={9} className='articleTexts'>
                                <h4>{title}</h4>
                                <p>
                                    {description}
                                </p>
                            </Grid>
                        </Grid>
                    )
                })
                    :
                    <p className='noArticles'>No articles.</p>
            }
        </div>
    );
};

export default ArticleBrowserHOC(ArticleBrowser);