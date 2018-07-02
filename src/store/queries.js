import gql from 'graphql-tag';

export const LoginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {  
            token
            refreshToken
            error           
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

export const currentUserQuery = gql`
    query currentUser($id: Int, $language: LanguageCodeType!) {
        profile(id: $id, language: $language) {
            id
            email
            firstName
            lastName
            featuredArticles {
                id
                author {
                    id
                    email
                    firstName
                    lastName
                }
                image {
                    isFeatured
                    title
                    path
                }
                video {
                    isFeatured
                    title
                    path
                }
                title
                description
            }
            skills {
                id
                i18n {
                    title
                }
            }
            values {
                id
                i18n {
                    title
                }
            }
            experience {
                id
                position
                company
                description
                startDate
                endDate
                isCurrent
            }
            projects {
                id
                position
                company
                description
                startDate
                endDate
                isCurrent
            }
            contact {
                phone
                email
                facebook
                linkedin
            }
            hasAvatar
            hasProfileCover
            coverBackground
            story {
                i18n {
                    title
                    description
                }
            }
            salary {
                amount
                currency
                isPublic
            }
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
           id
           hasAvatar
        }
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
        currentUser @client {
            id
            firstName
            lastName
            email
            hasAvatar
        }
    }
`;

export const setCoverBackground = gql`
    mutation setCoverBackground($color: String) {
        setCoverBackground(color: $color) {
           id
           coverBackground
        }
    }
`;

export const setHasBackgroundImage = gql`
    mutation profileCover($status: Boolean) {
        profileCover(status: $status) {
           id
           hasProfileCover
        }
    }
`;

export const setSkills = gql`
    mutation setSkills($skills: [String!]!, $language: LanguageCodeType!) {
        setSkills(skills: $skills, language: $language) {
            status
            error
        }
    }
`;

export const removeSkill = gql`
    mutation removeSkill($id: Int) {
        removeSkill(id: $id){
            status
            error
        }
    }
`;

export const setValues = gql`
    mutation setValues($values: [String!]!, $language: LanguageCodeType!) {
        setValues(values: $values, language: $language) {
            status
            error
        }
    }
`;

export const removeValue = gql`
    mutation removeValue($id: Int) {
        removeValue(id: $id){
            status
            error
        }
    }
`;

export const setExperience = gql`
    mutation setExperience($id: String, $location: Int, $isCurrent: Boolean, $position: String, $company: String, $startDate: Date, $endDate: Date, $title: String, $description: String, $language: LanguageCodeType!) {
        setExperience(id: $id, location: $location, isCurrent: $isCurrent, position: $position, company: $company, startDate: $startDate, endDate: $endDate, title: $title, description: $description, language: $language) {
            status
            error
        }
    }
`;

export const setProject = gql`
    mutation setProject($id: String, $location: Int, $isCurrent: Boolean, $position: String, $company: String, $startDate: Date, $endDate: Date, $title: String, $description: String, $language: LanguageCodeType!) {
        setProject(id: $id, location: $location, isCurrent: $isCurrent, position: $position, company: $company, startDate: $startDate, endDate: $endDate, title: $title, description: $description, language: $language) {
            status
            error
        }
    }
`;

export const setContact = gql`
    mutation setContact($phone: String, $email: String, $facebook: String, $linkedin: String) {
        setContact(phone: $phone, email: $email, facebook: $facebook, linkedin: $linkedin) {
            status
            error
        }
    }
`;

export const getArticles = gql`
    query articles($language: LanguageCodeType!) {
        articles(language: $language) {
            id
            author {
                id
                email
                firstName
                lastName
            }
            image {
                id
                title
                isFeatured
                source
            }
            video {
                id
                title
                isFeatured
                source
            }
            title
            description
            created_at
            updated_at
        }
    }
`;

export const handleArticle = gql`
    mutation handleArticle($language: LanguageCodeType!, $article: ArticleInput, $options: ArticleOptions) {
        handleArticle(language: $language, article: $article, options: $options) {
            status
            status
        }
    }
`;