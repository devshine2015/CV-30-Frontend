import React from 'react';
import { Grid } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import FeedArticlesList from '../../../feed/components/feedArticlesList';

import { getFeedArticles, getCurrentUser } from '../../../../store/queries';

const FeedHOC = compose(
    withRouter,
    graphql(getCurrentUser, { name: 'currentUser' }),
    graphql(getFeedArticles, {
        name: 'feedArticlesQuery',
        options: ({ match: { params }, currentUser}) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: params.lang,
                userId: params.profileId ? params.profileId : (currentUser.auth.currentUser ? currentUser.auth.currentUser.id : undefined),
                first: 10
            }
        }),
    }),
    pure
);

const Feed = ({ feedArticlesQuery }) => {
    return (
        <Grid container className='mainBody profileFeed'>
            <Grid item md={8} xs={11} className='articlesContainer'>
                <FeedArticlesList feedArticlesQuery={feedArticlesQuery}/>
            </Grid>
        </Grid>
    );
};

export default FeedHOC(Feed);