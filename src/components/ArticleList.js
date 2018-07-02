import React from 'react';
import { Grid } from '@material-ui/core';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { getArticles } from '../store/queries';

const StoryBrowserHOC = compose(
    withRouter,
    graphql(getArticles, {
        name: 'getArticles',
        options: (props) => ({
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    withHandlers({
    }),
    pure
);

const StoryBrowser = props => {
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
                (articles && articles.length > 0) ? articles.map((story, index) => (
                    <Grid container className='storyItem' onClick={() => console.log(story.title)} key={`article-${index}`}>
                        <Grid item sm={12} md={3} className='media'>
                            <img src={story.imgUrl} alt={story.title} />
                        </Grid>
                        <Grid item sm={12} md={9} className='texts'>
                            <h4>{story.title}</h4>
                            <p>
                                {story.text}
                            </p>
                        </Grid>
                    </Grid>
                ))
                    :
                    <p className='noArticles'>No articles.</p>
            }
        </div>
    );
};

export default StoryBrowserHOC(StoryBrowser);