export default {
    auth: {
        __typename: "Authentication",
        loggedIn: false,
    },
    currentUser: {
        __typename: "User",
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        hasAvatar: false
    }
};