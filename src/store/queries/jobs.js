import gql from 'graphql-tag';

export const getJobsQuery = gql`
query jobs($language: LanguageCodeType!) {
    jobs(language: $language) {
        id
        expireDate
        name
        i18n {
            title
            description
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
        }
        team {
            id
        }
    }
}
`;