import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import UserProfile from './component';
import { currentUserQuery } from '../../../store/queries'

const UserProfileHOC = compose(
    withRouter,
    graphql(currentUserQuery, {
        name: 'currentUser',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: props.match.params.userId || null
            },
            fetchPolicy: 'network-only'
        }),
    }),
    withState('editMode', 'updateEditMode', false),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);

export default UserProfileHOC(UserProfile);