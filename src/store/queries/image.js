import gql from 'graphql-tag';

export const userImagesQuery = gql`
query images {
    images {
        id
        sourceId
        sourceType
        isFeatured
        path
    }
}
`;