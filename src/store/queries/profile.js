import gql from 'graphql-tag';

const profileFollowingData = gql`
    fragment profileFollowingData on Profile {
        followees {
            id
            email
            firstName
            lastName
            hasAvatar
            avatarPath
        }
        followingCompanies {
            id
            name
            industry {
                id
                title
            }
            logoPath
        }
        followingTeams {
            id
            name
        }
        followingJobs {
            id
            title
        }
    }
`;

const profileAppliedJobsData = gql`
    fragment profileAppliedJobsData on Profile {
        appliedJobs {
            id
            location
            title
            company {
                id
                name
                location
                logoPath
            }
        }
    }
`


export const profileQuery = gql`
query profile($id: String, $language: LanguageCodeType!) {
    profile(id: $id, language: $language) {
        id
        email
        firstName
        lastName
        position
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
        title
        description
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
        title
        description
    }
    skills {
        id
        title
    }
    values {
        id
        title
    }
    experience {
        id
        position
        company
        location
        startDate
        endDate
        isCurrent
        title
        description
        videos {
            id
            path
        }
        images {
            id
            path
        }
    }
    projects {
        id
        position
        company
        location
        title
        description
        startDate
        endDate
        isCurrent
        videos {
            id
            path
        }
        images {
            id
            path
        }
    }
    contact {
        phone
        email
        facebook
        linkedin
    }
    avatarPath
    coverPath
    coverBackground
    story {
        title
        description
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
    followers {
        id
    }
    ownedCompanies {
        id
        name
        logoPath
        teams {
            id
            name
            coverPath
        }
    }
    ...profileFollowingData
    ...profileAppliedJobsData
  }
}
${profileFollowingData}
${profileAppliedJobsData}
`;

export const updateUserSettingsMutation = gql`
    mutation updateUserSettings($userSettings: UserSettingsInput, $position: String) {
        updateUserSettings(userSettings: $userSettings) {
            status
            error
        }
        setPosition(position: $position) {
            status
            error
        }
    }
`;



export const updateAvatar = gql`
    mutation updateAvatar($status: Boolean, $contentType: ImageType, $path: String) {
        avatar(status: $status, contentType: $contentType, path: $path) {
            status
            error
        }
    }
`;

export const updateCoverMutation = gql`
    mutation updateCoverMutation($status: Boolean, $color: String, $contentType: ImageType, $path: String) {
        profileCover(status: $status, contentType: $contentType, path: $path) {
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

export const setValues = gql`
    mutation setValues($values: [String!]!, $language: LanguageCodeType!) {
        setValues(values: $values, language: $language) {
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

export const profilesQuery = gql`
    query profiles($language: LanguageCodeType!) {
        profiles(language: $language) {
            id
            email
            firstName
            lastName
            position
            skills {
                id
                title
            }
            values {
                id
                title
            }
            aboutMeArticles {
                id
                title
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
            avatarContentType
            avatarPath
            errors {
                name
                value
                statusCode
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

export const setPosition = gql`
mutation setPosition($position: String) {
    setPosition(position: $position) {
        status
        error
    }
}
`;

export const loggedInUserProfile = gql`
    query loggedInUserProfile($id: String, $language: LanguageCodeType!) {
        profile(id: $id, language: $language){
            id
            email
            firstName
            lastName
            avatarPath
            position            
            ownedCompanies {
                id
                name
                location
                logoPath
            }
        }
    }
`;