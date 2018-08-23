import UserSettings from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

import { profileQuery } from '../../../store/queries';

const UserSettingsHOC = compose(
    graphql(profileQuery, {
        name: 'currentProfileQuery',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: props.match.params.profileId
            },
            fetchPolicy: 'network-only'
        }),
    }),
    withState('activeTab', 'setActiveTab', props => {
        return props.location.state && props.location.state.activeTab ? props.location.state.activeTab : 'settings';
    }),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);

export default UserSettingsHOC(UserSettings);