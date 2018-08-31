import gql from 'graphql-tag';

const minimumCompanyResult = gql`
  fragment minimumCompanyResult on Company {
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
    logoPath
    industry {
      id 
      i18n {
        title
      }
    }
  }
`;

const companyJobData = gql`
  fragment companyJobData on Job {
    id
    name
    expireDate
    location
    i18n {
      title
      description
    }
  }
`;

export const companyQuery = gql`
query company($id: String!, $language: LanguageCodeType!) {
  company(id: $id, language: $language) {
    ...minimumCompanyResult
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
    noOfEmployees
    faqs {
      id
      i18n {
        question
        answer
      }
    }
    jobs {
      ...companyJobData
    }
    teams {
      id
      name
      hasProfileCover
      coverContentType
      coverBackground
    }
    owner {
      id
    }    
    coverPath
    coverBackground
  }
}
${minimumCompanyResult}
${companyJobData}
`;

export const companiesQuery = gql`
  query companies($language: LanguageCodeType!) {
    companies(language: $language) {
      ...minimumCompanyResult
    }
  }
  ${minimumCompanyResult}
`;

export const industriesQuery = gql`
  query industries($language: LanguageCodeType!) {
    industries(language: $language) {
      id
      i18n {
        title
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