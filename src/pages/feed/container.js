import NewsFeed from './component';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { currentProfileQuery, getNewsFeedArticles } from '../../store/queries';

const NewsFeedHOC = compose(
    withRouter,
    graphql(currentProfileQuery, {
        name: 'currentUser',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                id: null
            }
        }),
    }),
    graphql(getNewsFeedArticles, {
        name: 'newsFeedArticlesQuery',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        }),
    }),
    pure
);

export default NewsFeedHOC(NewsFeed);