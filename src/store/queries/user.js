import gql from 'graphql-tag';

export const handleFollow = gql`
    mutation handleFollow($details: FollowInput!) {
        handleFollow(details: $details) {
            status
            error
        }
    }
`;

export const handleApplyToJob = gql`
    mutation handleApplyToJob($jobId: String!, $isApplying: Boolean!) {
        handleApplyToJob(jobId: $jobId, isApplying: $isApplying) {
            status
            error
        }
    }
`;

export const deleteAccountMutation = gql`
    mutation deleteProfile {
        deleteProfile {
            status
        }
    }
`;