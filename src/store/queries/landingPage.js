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
    query landingPage($language: LanguageCodeType!) {
        landingPage(language: $language) {
            hasCover
            coverContentType
            coverBackground
            coverPath
            hasFooterCover
            footerCoverContentType
            footerCoverPath
            footerCoverBackground
            i18n {
                headline
                footerMessage
            }           
        }
    }
`;