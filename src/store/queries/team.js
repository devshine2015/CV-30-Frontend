import gql from 'graphql-tag';

export const handleTeam = gql`
    mutation handleTeam($teamDetails: TeamInput!) {
        handleTeam(teamDetails: $teamDetails) {
            status
            error
        }
    }
`;

export const queryTeam = gql`
    query team($id: String!, $language: LanguageCodeType!) {
  team(id: $id, language: $language) {
    id
    name
    company {
      id
      name
      owner {
        id
      }
    }
    members {
      id
      firstName
      lastName
      email
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
    jobs {
      id
      name
      expireDate
      i18n {
        title
        description
      }
    }
    hasProfileCover
    coverBackground
    coverContentType
  }
}
`;

export const addMemberToTeam = gql`
    mutation addMemberToTeam($teamId: String!, $memberId: String!) {
        addMemberToTeam(teamId: $teamId, memberId: $memberId) {
            status
            error
        }
    }
`;

export const removeMemberFromTeam = gql`
    mutation removeMemberFromTeam($teamId: String!, $memberId: String!) {
        removeMemberFromTeam(teamId: $teamId, memberId: $memberId) {
            status
            error
        }
    }
`;

export const teamsQuery = gql`
    query teams($language: LanguageCodeType!) {
        teams(language: $language) {
            id
            name
        }
    }
`;