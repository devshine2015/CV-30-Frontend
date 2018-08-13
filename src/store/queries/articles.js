import gql from 'graphql-tag';

const standardArticleResult = gql`
    fragment standardArticleResult on Article {
        id
        author {
            id
            email
            firstName
            lastName
            hasAvatar
            avatarContentType
        }
        isPost
        postAs
        postingCompany {
            id
            name
        }
        postingTeam {
            id
            name
        }
        images {
            id
            path
        }
        videos {
            id
            path
        }
        i18n {
            title
            description
        }
        tags {
            id
            i18n {
                title
            }
            users {
                id
                email
            }
        }
        createdAt
        updatedAt
    }
`;

export const getArticles = gql`
    query articles($language: LanguageCodeType!) {
        articles(language: $language) {
            ...standardArticleResult
        }
    }
    ${standardArticleResult}
`;

export const getArticle = gql`
    query article($id: String!, $language: LanguageCodeType!) {
        article(id: $id, language: $language) {
            ...standardArticleResult
        }
    }
    ${standardArticleResult}
`;

export const getNewsFeedArticles = gql`
    query newsFeedArticles($language: LanguageCodeType!) {
        newsFeedArticles(language: $language) {
            following {
                ...standardArticleResult
            }
            others {
                ...standardArticleResult
            }
        }
    }
    ${standardArticleResult}
`;

export const getFeedArticles = gql`
    query feedArticles($language: LanguageCodeType!, $userId: String, $companyId: String, $teamId: String) {
        feedArticles(language: $language, userId: $userId, companyId: $companyId, teamId: $teamId) {
            ...standardArticleResult
        }
    }
    ${standardArticleResult}
`;

export const handleArticle = gql`
    mutation handleArticle($language: LanguageCodeType!, $article: ArticleInput, $options: ArticleOptions) {
        handleArticle(language: $language, article: $article, options: $options) {
            status
            error
        }
    }
`;

export const handleArticleTag = gql`
    mutation handleArticleTag($language: LanguageCodeType!, $details: ArticleTagInput!) {
        handleArticleTag(language: $language, details: $details) {
            status
            error
        }
    }
`;