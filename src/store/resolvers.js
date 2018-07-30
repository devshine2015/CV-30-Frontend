import gql from 'graphql-tag';

export default {
    Query: {},
    Mutation: {
        updateGoogleMaps: (_, { isLoaded }, { cache }) => {
            const data = {
                googleMaps: {
                    __typename: "GoogleMapsAPI",
                    isLoaded
                }
            };
            cache.writeData({ data });
            return null;
        },
        updateAvatarTimestamp: (_, { timestamp }, { cache }) => {
            const data = {
                localUser: {
                    __typename: "LocalUser",
                    timestamp
                }
            };
            cache.writeData({ data });
            return null;
        },
        setAuthenticated: (_, { status, user }, { cache }) => {
            const data = {
                auth: {
                    __typename: "Authentication",
                    loggedIn: status,
                    currentUser: user
                }
            };
            cache.writeData({ data });
            return null;
        },
        setEditMode: (_, { status }, { cache }) => {
            debugger;
            const data = {
                editMode: {
                    __typename: "EditMode",
                    status
                }
            };
            cache.writeData({ data });
            return null;
        },
        resetEditMode: (_, props, { cache }) => {
            const data = {
                editMode: {
                    __typename: "EditMode",
                    status: false
                }
            };
            cache.writeData({ data });
            return null;
        },
        setFeedbackMessage: (_, { type, message }, { cache }) => { },
        resetFeedbackMessage: (_, { }, { cache }) => { }
    }
};


/*
editMode: {
        __typename: "EditMode",
        edit: {
            profile: false,
            company: false,
            team: false,
            job: false,
            landingPage: false,
        }
    },
    feedbackMessage: {
        __typename: "FeedbackMessage",
        message: {
            type: null,
            message: null
        }
    }
*/