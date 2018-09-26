import NewsFeed from './component';
import { compose, withState, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { profileQuery, getNewsFeedArticles } from '../../store/queries';

const NewsFeedHOC = compose(
    withRouter,
    withState('searchData', 'setSearchData', {
        peopleOrCompany: '',
        tags: []
    }),
    graphql(profileQuery, {
        name: 'currentProfileQuery',
        options: ({ match }) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: match.params.lang,
                id: null
            }
        }),
    }),
    graphql(getNewsFeedArticles, {
        name: 'newsFeedArticlesQuery',
        options: ({ match, searchData: { peopleOrCompany, tags } }) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: match.params.lang,
                peopleOrCompany,
                tags,
                first: 10
            }
        }),
    }),
    pure
);

export default NewsFeedHOC(NewsFeed);