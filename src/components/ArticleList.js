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
    withHandlers({}),
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
                (articles && articles.length > 0) ? articles.map(article => (
                    <Grid container className='articleItem' onClick={() => console.log(article.title)} key={article.id}>
                        <Grid item sm={12} md={3} className='articleMedia'>
                            <img src={article.imgUrl} alt={article.title} />
                        </Grid>
                        <Grid item sm={12} md={9} className='articleTexts'>
                            <h4>{article.title}</h4>
                            <p>
                                {article.text}
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