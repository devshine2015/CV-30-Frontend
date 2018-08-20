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
            id
            name
            location
        }
        location
    }
}
`;

export const getJobQuery = gql`
query job($id: String!, $language: LanguageCodeType!) {
  job(id: $id, language: $language) {
    id
    createdAt
    expireDate
    i18n {
      title
      description
      idealCandidate
    }
    company {
      id
      name
      jobs {
        id
      }
      i18n {
        description
      }
      officeArticles {
        id
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
      }
      faqs {
        id
        i18n {
          question
          answer
        }
      }
      owner {
        id
      }
    }
    team {
      id
      name
    }
    phone
    email
    facebook
    linkedin
    applicants {
      id
    }
    location
  }
}
`;

export const jobTypesQuery = gql`
	query jobTypes($language: LanguageCodeType!) {
		jobTypes(language: $language) {
			id
			i18n {
				title
			}
		}
	}
`;

export const handleJob = gql`
    mutation handleJob($language: LanguageCodeType!, $jobDetails: JobInput!) {
        handleJob(language: $language, jobDetails: $jobDetails) {
            status
            error
        }
    }
`;