import gql from 'graphql-tag';

export const handleShallowUser = gql`
    mutation handleShallowUser($shallowUser: ShallowUserInput, $options: ShallowUserOptions) {
        handleShallowUser(shallowUser: $shallowUser, options: $options) {
            status
            error
        }
    }
`;