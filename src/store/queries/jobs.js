import gql from 'graphql-tag';
import { pageInfoData } from './common';

const jobsData = gql`
  fragment jobsData on Job {
    id
    expireDate
    title
    description
    company {
      id
      name
      location
      logoPath
    }
    location
    imagePath
    videoUrl
    status
    activityField {
      id
      title
    }
    jobTypes {
      id
      title
    }
    jobBenefits {
      id
      key
    }
  }
`;

export const getJobsQuery = gql`
query jobs(
  $language: LanguageCodeType!
  $filter: JobsFilterInput
  $first: Int!
  $after: String
) {
  jobs(language: $language, filter: $filter, first: $first, after: $after) {
    edges {
      node {
          ...jobsData
      }
      cursor
    }
    pageInfo {
      ...pageInfoData
    }
    
  }
}
${jobsData}
${pageInfoData}
`;

export const getJobQuery = gql`
query job($id: String!, $language: LanguageCodeType!) {
  job(id: $id, language: $language) {
    id
    createdAt
    expireDate
    imagePath
    videoUrl
    status
    title
    description
    idealCandidate
    company {
      id
      name
      description
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
        title
        description
      }
      faqs {
        id
        question
        answer
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
    skills {
      id
      key
    }
    activityField {
      id
      title
    }
    jobTypes {
      id
      title
    }
    salary {
      amountMin
      amountMax
      currency
      isPublic
    }
    jobBenefits {
      id
      key
    }
  }
}
`;

export const jobDependencies = gql`
	query jobDependencies($language: LanguageCodeType!, $companyId: String!) {
    company(id: $companyId, language: $language) {
      id
      teams {
        id
			  name
      }
    }
		jobTypes(language: $language) {
			id
			title
		}
		jobBenefits {
			id
			key
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