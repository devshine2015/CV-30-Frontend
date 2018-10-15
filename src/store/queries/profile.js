import gql from 'graphql-tag';
import { pageInfoData } from './common';

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
                key
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
        key
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
    educations {
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
    hobbies {
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

export const skillsQuery = gql`
    query skillsQuery {
        skills {
            id
            key
        }
    }
`;

export const setSkills = gql`
    mutation setSkills($skills: [Int!]!, $language: LanguageCodeType!) {
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

export const setExperienceMutation = gql`
    mutation setExperience($experience: ExperienceInput!, $language: LanguageCodeType!) {
        setExperience(experience: $experience, language: $language) {
            status
            error
        }
    }
`;

export const setProjectMutation = gql`
    mutation setProject($project: ProjectInput!, $language: LanguageCodeType!) {
        setProject(project: $project, language: $language) {
            status
            error
        }
    }
`;
//Add Hobbie and education

export const setEducationMutation = gql`
    mutation setEducation($education: EducationInput!, $language: LanguageCodeType!) {
        setEducation(education: $education, language: $language) {
            status
            error
        }
    }
`;
export const setHobbyMutation = gql`
    mutation setHobby($hobby: HobbyInput!, $language: LanguageCodeType!) {
        setHobby(hobby: $hobby, language: $language) {
            status
            error
        }
    }
`;

//End 
export const setContact = gql`
    mutation setContact($contact: ContactInput) {
        setContact(contact: $contact) {
            status
            error
        }
    }
`;

const profilesData = gql`
    fragment profilesData on Profile {
        id
        email
        firstName
        lastName
        position
        skills {
            id
            key
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
        currentPosition {
            experience {
                company
            }
            project {
                company
            }
        }
    }
`;

export const profilesQuery = gql`
    query profiles(
        $language: LanguageCodeType!
        $filter: ProfilesFilterInput
        $first: Int!
        $after: String
    ) {
        profiles(language: $language, filter: $filter, first: $first, after: $after) {
            edges {
                node {
                    ...profilesData
                }
                cursor
            }
                pageInfo {
                ...pageInfoData
            }
        }
    }
    ${profilesData}
    ${pageInfoData}
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

export const setCVFile = gql`
mutation setCVFile($cvFile: String) {
    setCVFile(cvFile: $cvFile) {
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