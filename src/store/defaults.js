export default {
    auth: {
        __typename: "Authentication",
        loggedIn: false,
        currentUser: null
    },
    localUser: {
        __typename: "LocalUser",
        timestamp: 0
    },
    googleMaps: {
        __typename: "GoogleMapsAPI",
        isLoaded: false
    },
    editMode: {
        __typename: "EditMode",
        status: false


    },
    feedbackMessage: {
        __typename: "FeedbackMessage",
        status: null,
        message: null

    }
};