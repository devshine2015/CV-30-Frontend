import { getAds } from '../queries';

export const adsRefetch = (language) => ({
    query: getAds,
    fetchPolicy: 'network-only',
    name: 'getAdsQuery',
    variables: {
        language
    }
});