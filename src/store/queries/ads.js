import gql from "graphql-tag";
// import { gql } from 'react-apollo'
export const getAds = gql`
    query ads($language: LanguageCodeType!) {
        ads(language: $language) {
            id
            image {
                id
                path
            }
            url
        }
    }
`;

export const handleAd = gql`
    mutation handleAd($language: LanguageCodeType!, $details: AdInput!) {
        handleAd(language: $language, details: $details) {
            status
            error
        }
    }
`;