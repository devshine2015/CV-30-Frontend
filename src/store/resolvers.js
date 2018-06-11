export default {
    Query: {},
    Mutation: {
        setAuthenticated: (_, { status }, { cache }) => {
            const data = { isAuthenticated: status, __typename: 'Authenticated' };
            cache.writeData({ data });
          },
    }
};