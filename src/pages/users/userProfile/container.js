import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import UserProfile from './component';
import { currentProfileQuery, getCurrentUser } from '../../../store/queries'

const UserProfileHOC = compose(
    withRouter,
    graphql(currentProfileQuery, {
        name: 'currentProfile',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(props.match.params.profileId) ?
                    props.match.params.profileId : null
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(getCurrentUser, {
        name: 'currentUser'
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