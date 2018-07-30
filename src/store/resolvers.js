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
    }
};