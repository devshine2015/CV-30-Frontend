import UsersList from './component';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { profilesQuery } from '../../../store/queries';

const UsersListHOC = compose(
    withRouter,
    graphql(profilesQuery, {
        name: 'profilesQuery',
        fetchPolicy: 'network-only',
        options: props => ({
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    pure
);
export default UsersListHOC(UsersList);