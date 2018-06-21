export default {
    Query: {},
    Mutation: {
        setAuthenticated: (_, { status }, { cache }) => {
            const data = {
                auth: {
                    __typename: "Authentication",
                    loggedIn: status
                }
            };
            cache.writeData({ data });
            return data;
        },
    }
};