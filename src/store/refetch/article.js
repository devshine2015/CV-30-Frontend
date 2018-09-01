import { getNewsFeedArticles, getArticle } from '../queries';

export const newsFeedArticlesRefetch = (language) => ({
    query: getNewsFeedArticles,
    fetchPolicy: 'network-only',
    name: 'newsFeedArticlesQuery',
    variables: {
        language
    }
});

export const articleRefetch = (id, language) => ({
    query: getArticle,
    fetchPolicy: 'network-only',
    name: 'getArticle',
    variables: {
        id,
        language
    },
});