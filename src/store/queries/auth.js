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
            avatarPath
            god
        }
    }
`;

export const LogoutMutation = gql`
    mutation logout {
        logout {
            status
            error
        }
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

export const ActivateAccountMutation = gql`
    mutation activateAccount($token: String!) {
        activateAccount(token: $token) {
            error
            status
        }
    }
`;

export const SignatureQuery = gql`
    query signature($id: String!) {
        signature(id: $id) {
            bucket
            region
            keyStart
            params {
                acl
        		policy
	        	x_amz_algorithm
		        x_amz_credential
    		    x_amz_date
	        	x_amz_signature
            }
        }
    }
`;