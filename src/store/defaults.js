export default {
    auth: {
        __typename: "Authentication",
        loggedIn: false,
    },
    currentUser: {
        __typename: "User",
        id: '0',
        firstName: '',
        lastName: '',
        email: '',
        hasAvatar: false
    }
};