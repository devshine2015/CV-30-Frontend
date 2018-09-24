import { companyQuery, companiesQuery } from '../queries';

export const companyRefetch = (id, language) => ({
    query: companyQuery,
    fetchPolicy: 'network-only',
    name: 'companyQuery',
    variables: {
        id,
        language
    }
});

export const companiesRefetch = (language) => ({
    query: companiesQuery,
    name: 'companiesQuery',
    fetchPolicy: 'network-only',
    variables: {
        language,
        first: 10
    }
});