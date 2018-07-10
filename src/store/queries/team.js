import gql from 'graphql-tag';

export const handleTeam = gql`
    mutation handleTeam($teamDetails: TeamInput!) {
        handleTeam(teamDetails: $teamDetails) {
            status
            error
        }
    }
`;