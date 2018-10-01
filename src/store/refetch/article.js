import { getArticle } from '../queries';

export const articleRefetch = (id, language) => ({
    query: getArticle,
    fetchPolicy: 'network-only',
    name: 'getArticle',
    variables: {
        id,
        language
    },
});