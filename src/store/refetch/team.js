import { queryTeam } from '../queries';

export const teamRefetch = (id, language) => ({
    query: queryTeam,
    fetchPolicy: 'network-only',
    name: 'queryTeam',
    variables: {
        id,
        language
    }
});