import gql from 'graphql-tag';

export const getJobsQuery = gql`
query jobs($language: LanguageCodeType!) {
    jobs(language: $language) {
        id
        expireDate
        i18n {
            title
            description
        }
        company {
            name
            location
        }
    }
}
`;

export const getJobQuery = gql`
query job($id: String!, $language: LanguageCodeType!) {
    job(id: $id, language: $language) {
        id
        expireDate
        i18n {
            title
            description
            idealCandidate
        }
        company {
            id
            name
            location
            featuredArticles {
                images {
                    source
                }
            }
            teams {
                id
            }
            i18n {
                description
            }
            faqs {
                id
                i18n {
                    answer
                    question
                }
            }
        }
        team {
            id
        }
    }
}
`;