import gql from 'graphql-tag';

export const pageInfoData = gql`
    fragment pageInfoData on PageInfo {
        hasNextPage
    }
`;