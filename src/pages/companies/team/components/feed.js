import React from 'react';
import { Grid } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import FeedArticlesList from '../../../feed/components/feedArticlesList';

import { getFeedArticles } from '../../../../store/queries';

const FeedHOC = compose(
    withRouter,
    graphql(getFeedArticles, {
        name: 'feedArticlesQuery',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                teamId: props.match.params.teamId,
                first: 10
            }
        }),
    }),
    pure
);

const Feed = ({ feedArticlesQuery }) => {
    return (
        <Grid container className='mainBody jobFeed'>
            <Grid item md={8} xs={11} className='articlesContainer'>
                <FeedArticlesList feedArticlesQuery={feedArticlesQuery}/>
            </Grid>
        </Grid>
    );
};

export default FeedHOC(Feed);