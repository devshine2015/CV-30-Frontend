import React from 'react';
import { Grid } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import ArticlesList from '../../../feed/components/articlesList';

import { getFeedArticles, getCurrentUser } from '../../../../store/queries';

const FeedHOC = compose(
    withRouter,
    graphql(getCurrentUser, {  name: 'currentUser' }),
    graphql(getFeedArticles, {
        name: 'feedArticlesQuery',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                userId: props.match.params.profileId ? props.match.params.profileId : (props.currentUser.auth.currentUser ? props.currentUser.auth.currentUser.id : undefined)
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