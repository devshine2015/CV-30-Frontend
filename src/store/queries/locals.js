import gql from 'graphql-tag';

export const IS_AUTHENTICATED = gql`
    query {
        auth @client {
            __typename
            currentUser
        }
    }
`;

export const AuthenticateLocal = gql`
    mutation setAuthenticated($user: User) {
        setAuthenticated(user: $user) @client
    }
`;

export const updateAvatarTimestampMutation = gql`
    mutation updateAvatarTimestamp($timestamp: Int!){
        updateAvatarTimestamp(timestamp: $timestamp) @client{
           localUser {
               __typename
               timestamp
           }
        }
    }
`;

export const localUserQuery = gql`
    query localUserQuery {
        localUser @client {
            timestamp
        }
    }
`;


export const getCurrentUser = gql`
    query getCurrentUser {
        auth @client {
             __typename
            currentUser {
                id
                firstName
                lastName
                email
                avatarPath
                god
                ownedCompanies {
                    id
                    name
                    location
                    logoPath
                }
                 __typename
            }
        }
    }
`;

export const setEditMode = gql`
    mutation setEditMode($status: Boolean!) {
        setEditMode(status: $status) @client {
            __typename
            status
        }
    }
`;

export const resetEditMode = gql`
    mutation resetEditMode {
        resetEditMode @client {
            __typename
            status
        }
    }
`;

export const getEditMode = gql`
    query getEditMode {
        editMode @client {
            __typename
            status
        }
    }
`;

export const setLanguageMutation = gql`
    mutation setLanguage ($code: String!) {
        setLanguage (code: $code) @client {
            __typename
            code
        }
    }
`

export const getLanguageQuery = gql`
    query getLanguage {
        language @client {
            __typename
            code
        }
    }
`
export const getFeedbackMessage = gql`
    query getFeedbackMessage {
        feedbackMessage @client {
            __typename
            status
            message
        }
    }
`;

export const setFeedbackMessage = gql`
    mutation setFeedbackMessage($status: String!, $message: String!) {
        setFeedbackMessage(status: $status, message: $message) @client {
            __typename
            status
            message
        }
    }
`;

export const resetFeedbackMessage = gql`
    mutation resetFeedbackMessage {
        resetFeedbackMessage @client
    }
`;

