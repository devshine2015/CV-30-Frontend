import { profileQuery } from '../queries';

export const currentProfileRefetch = (language) => ({
    query: profileQuery,
    fetchPolicy: 'network-only',
    name: 'currentProfileQuery',
    variables: {
        language
    }
});

export const profileRefetch = (id, language) => ({
    query: profileQuery,
    fetchPolicy: 'network-only',
    name: 'currentProfileQuery',
    variables: {
        id,
        language
    }
});