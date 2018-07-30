import gql from 'graphql-tag';

export const updateGoogleMapsMutation = gql`
    mutation updateGoogleMaps($isLoaded: Boolean!){
        updateGoogleMaps(isLoaded: $isLoaded) @client{
            googleMaps {
               __typename
               isLoaded
           }
        }
    }
`;

export const googleMapsQuery = gql`
    query googleMapsData{
        googleMaps @client {
            isLoaded
        }
    }
`;