import gql from 'graphql-tag';

export const companyQuery = gql`
 query company($id: String!, $language: LanguageCodeType!) {
  company(id: $id, language: $language) {
    id
    name
    i18n {
      headline
      description
    }
    featuredArticles {
      id
      i18n {
        title
        description
      }
      images {
        id
        path
      }
      videos {
        id
        path
      }
    }
    officeArticles {
      id
      i18n {
        title
        description
      }
      images {
        id
        path
      }
      videos {
        id
        path
      }
    }
    storiesArticles {
      id
      i18n {
        title
        description
      }
      images {
        id
        path
      }
      videos {
        id
        path
      }
    }
    activityField
    noOfEmployees
    location
    faqs {
      id
      i18n {
        question
        answer
      }
    }
    jobs {
      id
      name
      expireDate
      i18n {
        title
        description
      }
    }
    teams {
      id
      name
      hasProfileCover
      coverContentType
      coverBackground
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

export const handleCompany = gql`
    mutation handleCompany($language: LanguageCodeType!, $details: CompanyInput!) {
        handleCompany(language: $language, details:  $details){
            status
            error
        }
    }
`;

export const handleFAQ = gql`
  mutation handleFAQ($language: LanguageCodeType!, $faq: FaqInput!) {
    handleFAQ(language: $language, faq: $faq) {
      status
      error
    }
  }
`;