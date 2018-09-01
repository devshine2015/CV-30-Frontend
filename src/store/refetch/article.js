import { getNewsFeedArticles } from '../queries';

export const newsFeedArticlesRefetch = (language) => ({
    query: getNewsFeedArticles,
    fetchPolicy: 'network-only',
    name: 'newsFeedArticlesQuery',
    variables: {
        language
    }
});