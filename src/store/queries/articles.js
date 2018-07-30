import gql from 'graphql-tag';

export const getArticles = gql`
    query articles($language: LanguageCodeType!) {
        articles(language: $language) {
            id
            author {
                id
                email
                firstName
                lastName
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
            created_at
            updated_at
        }
    }
`;

export const getNewsFeedArticles = gql`
    query newsFeedArticles($language: LanguageCodeType!) {
        newsFeedArticles(language: $language) {
            following {
                id
                author {
                    id
                    email
                    firstName
                    lastName
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
                created_at
                updated_at
            }
            others {
                id
                author {
                    id
                    email
                    firstName
                    lastName
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
                created_at
                updated_at
            }
        }
    }
`;

export const handleArticle = gql`
    mutation handleArticle($language: LanguageCodeType!, $article: ArticleInput, $options: ArticleOptions) {
        handleArticle(language: $language, article: $article, options: $options) {
            status
            error
        }
    }
`;

export const getArticle = gql`
    query article($id: String!, $language: LanguageCodeType!) {
        article(id: $id, language: $language) {
            id
            author {
                id
                email
                firstName
                lastName
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
            created_at
            updated_at
        }
    }
`;