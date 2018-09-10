import gql from 'graphql-tag';

const companyJobData = gql`
  fragment companyJobData on Job {
    id    
    expireDate
    location
    title
    description
    imagePath
    videoUrl
  }
`;

const minimumCompanyData = gql`
  fragment minimumCompanyData on Company {
    id
    name
    location
    noOfEmployees
    headline
    description
    logoPath
    industry {
      id 
      title
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
  }
  ${companyJobData}
`;

export const companyQuery = gql`
query company($id: String!, $language: LanguageCodeType!) {
  company(id: $id, language: $language) {
    ...minimumCompanyData
    featuredArticles {
      id
      title
      description
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
      title
      description
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
      title
      description
      images {
        id
        path
      }
      videos {
        id
        path
      }
    }
    faqs {
      id
      question
      answer
    }
    owner {
      id
    }    
    coverPath
    coverBackground
  }
}
${minimumCompanyData}
`;

export const companiesQuery = gql`
  query companies($language: LanguageCodeType!) {
    companies(language: $language) {
      ...minimumCompanyData
    }
  }
  ${minimumCompanyData}
`;

export const industriesQuery = gql`
  query industries($language: LanguageCodeType!) {
    industries(language: $language) {
      id
      title
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