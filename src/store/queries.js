import gql from 'graphql-tag';

export const LoginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {  
            token
            refreshToken
            error
            id
            email
            firstName
            lastName
            hasAvatar
        }        
    }
`;

export const LogoutMutation = gql`
    mutation logout {
        logout {
            status
            error
        }
        setAuthenticated(status: false) @client
    }
`;

export const RegisterMutation = gql`
    mutation register($nickname: String!, $email: String!, $password: String!) {
        register(nickname: $nickname, email: $email, password: $password) {
            status
            error
        }
    }
`;

export const ForgotPasswordMutation = gql`
    mutation forgotPassword($email: String!){
        forgotPassword(email: $email){
            status
            error
        }
    }
`;

export const IS_AUTHENTICATED = gql`
    query {
        auth @client {
            __typename
            loggedIn
        }
    }
`;

export const ActivateAccountMutation = gql`
    mutation activateAccount($token: String!) {
        activateAccount(token: $token) {
            error
            status
        }
    }
`;

export const AuthenticateLocal = gql`
    mutation setAuthenticated($user: User) {
        setAuthenticated(status: true, user: $user) @client
    }
`;

export const ProfileQuery = gql`
    query profile($id: Int, $language: LanguageCodeType!)  {
        profile (id: $id, language: $language){
            firstName
            lastName
            hasAvatar
            hasProfileCover
            coverBackground
            errors {
                name
                value
                statusCode
            }
        }
    }
`;

export const currentUserQuery = gql`
    query currentUser($id: Int, $language: LanguageCodeType!)  {
            profile (id: $id, language: $language){
                firstName
                lastName
                hasAvatar
                hasProfileCover
                coverBackground
                errors {
                    name
                    value
                    statusCode
                }
            }
        }
`;

export const updateAvatar = gql`
    mutation updateAvatar($status:Boolean!){
        avatar(status: $status){
            status
            error
        }
    }
`;