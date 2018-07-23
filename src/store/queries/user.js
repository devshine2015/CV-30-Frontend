import gql from 'graphql-tag';

export const handleFollow = gql`
    mutation handleFollow($details: FollowInput!) {
        handleFollow(details: $details) {
            status
            error
        }
    }
`;