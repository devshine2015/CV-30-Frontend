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
        setAuthenticated: (_, { user }, { cache }) => {
            const data = {
                auth: {
                    __typename: "Authentication",
                    currentUser: user
                }
            };
            cache.writeData({ data });
            return null;
        },
        setEditMode: (_, { status }, { cache }) => {
            const data = {
                editMode: {
                    __typename: "EditMode",
                    status
                }
            };
            cache.writeData({ data });
            return null;
        },
        setLanguage: (_, { code }, {cache}) => {
            const data = {
                language: {
                    __typename: "Langauge",
                    code
                }
            }
            cache.writeData({data})
            return null
        },
        resetEditMode: (_, params, { cache }) => {
            const data = {
                editMode: {
                    __typename: "EditMode",
                    status: false
                }
            };
            cache.writeData({ data });
            return null;
        },
        setFeedbackMessage: (_, { status, message }, { cache }) => {
            const data = {
                feedbackMessage: {
                    __typename: "FeedbackMessage",
                    status,
                    message
                }
            };
            cache.writeData({ data });
            return null;
        },
        resetFeedbackMessage: (_, params, { cache }) => {
            const data = {
                feedbackMessage: {
                    __typename: "FeedbackMessage",
                    status: null,
                    message: null
                }
            };
            cache.writeData({ data });
            return null;
        }
    }
};