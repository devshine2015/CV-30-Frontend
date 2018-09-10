import gql from 'graphql-tag';

const standardArticleData = gql`
    fragment standardArticleData on Article {
        id
        images {
            id
            path
        }
        videos {
            id
            path
        }
        title
        description
        featuredImage {
            id
            path
        }
        createdAt
        updatedAt
    }
`;

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
            articles {
                ...standardArticleData
            }      
        }
    }
    ${standardArticleData}
`;