import gql from 'graphql-tag';

export const handleLandingPage = gql`
    mutation handleLandingPage($language: LanguageCodeType!, $details: LandingPageInput!) {
        handleLandingPage(language: $language, details: $details) {
            status
            error
        }
    }
`;

export const landingPage = gql`
    query company($language: LanguageCodeType!) {
        company(language: $language) {
            i18n {
                headline
                footerMessage
            }
            hasCover
            coverBackground
            coverContentType
            hasFooterCover
            footerCoverBackground
            footerCoverContentType
        }
    }
`;