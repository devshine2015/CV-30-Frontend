export default {
    auth: {
        __typename: "Authentication",
        currentUser: null
    },
    localUser: {
        __typename: "LocalUser",
        timestamp: 0
    },
    editMode: {
        __typename: "EditMode",
        status: false
    },
    language: {
        __typename: "Language",
        code: "en"
    },
    feedbackMessage: {
        __typename: "FeedbackMessage",
        status: null,
        message: null

    }
};