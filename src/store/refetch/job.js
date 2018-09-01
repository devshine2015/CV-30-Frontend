import { getJobQuery } from '../queries';

export const jobRefetch = (id, language) => ({
    query: getJobQuery,
    fetchPolicy: 'network-only',
    name: 'getJobQuery',
    variables: {
        id,
        language
    }
});