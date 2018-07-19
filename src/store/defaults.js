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
    }
};