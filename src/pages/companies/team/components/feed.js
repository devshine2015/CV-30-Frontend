import React from 'react';
import { Grid } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import ArticlesList from '../../../feed/components/articlesList';

import { getFeedArticles } from '../../../../store/queries';

const FeedHOC = compose(
    withRouter,
    graphql(getFeedArticles, {
        name: 'feedArticlesQuery',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                teamId: props.match.params.teamId
            }
        }),
    }),
    pure
);

const Feed = props => {
    const {
        feedArticlesQuery,
    } = props;
    const articles = feedArticlesQuery.feedArticles ? feedArticlesQuery.feedArticles : [];

    return (
        <Grid container className='mainBody brandShow'>
            <Grid item lg={6} md={6} sm={10} xs={11} className='centralColumn'>
                <ArticlesList articles={articles}/>
            </Grid>
        </Grid>
    );
};

export default FeedHOC(Feed);