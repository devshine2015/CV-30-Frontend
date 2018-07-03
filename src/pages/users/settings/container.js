import UserSettings from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

import { currentUserQuery } from '../../../store/queries';

const UserSettingsHOC = compose(
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
    withState('activeTab', 'setActiveTab', 'settings'),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);

export default UserSettingsHOC(UserSettings);