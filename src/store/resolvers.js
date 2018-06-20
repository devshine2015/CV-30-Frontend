export default {
    Query: {},
    Mutation: {
        setAuthenticated: (_, { status, user }, { cache }) => {
            const data = {
                auth: {
                    __typename: "Authentication",
                    loggedIn: status
                },
                currentUser: {
                    __typename: "User",
                    ...user
                }
            };
            cache.writeData({ data });
            return data;
        },
    }
};