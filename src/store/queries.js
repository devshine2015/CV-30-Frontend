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

export const updateUserSettingsMutation = gql`
    mutation updateUserSettings($userSettings: UserSettingsInput) {
        updateUserSettings(userSettings: $userSettings) {  
            status
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
  query currentUser($id: String, $language: LanguageCodeType!) {
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
      images {
        id
        path
      }
      videos {
        id
        path
      }
      i18n {
        title
        description
      }
    }
    aboutMeArticles {
      id
      author {
        id
        email
        firstName
        lastName
      }
      images {
        id
        path
      }
      videos {
        id
        path
      }
      i18n {
        title
        description
      }
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
      startDate
      endDate
      isCurrent
      i18n {
        title
        description
      }
    }
    projects {
      id
      position
      company
      i18n {
        title
        description
      }
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
           status
        }
    }
`;

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

export const updateCoverMutation = gql`
    mutation updateCoverMutation($status: Boolean, $color: String) {
        profileCover(status: $status) {
            status
            error
        }
        setCoverBackground(color: $color) {
            status
            error
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
    mutation setExperience($experience: ExperienceInput!, $language: LanguageCodeType!) {
        setExperience(experience: $experience, language: $language) {
            status
            error
        }
    }
`;

export const setProject = gql`
    mutation setProject($project: ProjectInput!, $language: LanguageCodeType!) {
        setProject(project: $project, language: $language) {
            status
            error
        }
    }
`;

export const setContact = gql`
    mutation setContact($contact: ContactInput) {
        setContact(contact: $contact) {
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
            images {
                id
                path
                }
            videos {
                id
                path
                }
            i18n {
                title
                description
                }
            created_at
            updated_at
        }
    }
`;

export const handleArticle = gql`
    mutation handleArticle($language: LanguageCodeType!, $article: ArticleInput, $options: ArticleOptions) {
        handleArticle(language: $language, article: $article, options: $options) {
            status
            error
        }
    }
`;

export const handleCompany = gql`
    mutation handleCompany($language: LanguageCodeType!, $details: CompanyInput!) {
        handleCompany(language: $language, details:  $details){
            status
            error
        }
    }
`;

export const profilesQuery = gql`
    query profiles($language: LanguageCodeType!) {
        profiles(language: $language) {
            id
            email
            firstName
            lastName
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
            aboutMeArticles {
                id
                i18n {
                    title
                }
                images {
                    id
                    path
                }
                videos {
                    id
                    path
                }
            }
            hasAvatar
            errors {
                name
                value
                statusCode
            }
        }
    }
`;

export const companiesQuery = gql`
    query companies($language: LanguageCodeType!) {
        companies(language: $language) {
            id
            name
            i18n {
                headline
                description
            }
            featuredArticles {
                id
                images {
                    id
                    path
                }
                videos {
                    id
                    path
                }
            }
        }
    }
`;

export const setStory = gql`
    mutation setStory($story: StoryInput, $language: LanguageCodeType!) {
        setStory(story: $story, language: $language) {
            status
            error
        }
    }
`;

export const setSalary = gql`
    mutation setSalary($salary: SalaryInput) {
        setSalary(salary: $salary) {
            status
            error
        }
    }
`;

export const getCompanyQuery = gql`
query company($id: String!, $language: LanguageCodeType!) {
  company(id: $id, language: $language) {
    id
    name
    i18n {
      headline
      description
    }
    activityField
    noOfEmployees
    location
    jobs {
      id
      name
      expireDate
      i18n {
        title
        description
      }
      team {
        id
        name
        members {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
}
`;