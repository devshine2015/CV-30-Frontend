import gql from 'graphql-tag';

export const companyQuery = gql`
    query company($id: String!, $language: LanguageCodeType!) {
        company(id: $id, language: $language) {
            id
            name
            featuredArticles {
                id
                featuredImage {
                    path
                }
            }
            storiesArticles {
                id
                featuredImage {
                    path
                }
            }
            faqs {
                id
            }
            jobs {
                id
            }
            noOfEmployees
            location
            activityField
            teams {
                id
                name
                hasProfileCover
                profileBackgroundColor
            }
        }
    }
`;

export const companiesQuery = gql`
    query companies($language: LanguageCodeType!) {
        companies(language: $language) {
            id
            name
            location
            noOfEmployees
            i18n {
                headline
                description
            }
            featuredArticles {
                id
                images {
                    id
                    path
                }
                videos {
                    id
                    path
                }
            }
        }
    }
`;

export const getCompanyQuery = gql`
query company($id: String!, $language: LanguageCodeType!) {
    company(id: $id, language: $language) {
        id
        name
        noOfEmployees
        i18n {
            headline
            description
        }
        activityField
        location
        jobs {
            id
            name
            expireDate
            i18n {
                title
                description
            }
            team {
                id
                name
                members {
                    id
                    firstName
                    lastName
                    email
                }
            }
        }
    }
}
`;

export const handleCompany = gql`
    mutation handleCompany($language: LanguageCodeType!, $details: CompanyInput!) {
        handleCompany(language: $language, details:  $details){
            status
            error
        }
    }
`;