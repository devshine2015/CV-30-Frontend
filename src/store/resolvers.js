export default {
    Query: {},
    Mutation: {
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
        setAuthenticated: (_, { status }, { cache }) => {
            const data = {
                auth: {
                    __typename: "Authentication",
                    loggedIn: status
                }
            };
            cache.writeData({ data });
            return null;
        },
    }
};