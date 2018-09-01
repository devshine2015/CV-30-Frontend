import { landingPage } from '../queries';

export const landingPageRefetch = (language) => ({
    query: landingPage,
    fetchPolicy: 'network-only',
    name: 'landingPage',
    variables: {
        language
    }
});