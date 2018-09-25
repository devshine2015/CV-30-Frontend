import UsersList from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { profilesQuery } from '../../../store/queries';

const UsersListHOC = compose(
    withRouter,
    graphql(profilesQuery, {
        name: 'profilesQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                first: 10
            },
        }),
    }),
    withState('formData', 'setFormData', {}),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        handleSliderChange: () => value => {
            console.log(value);
        },
        toggleIsProfileVerified: ({ setFormData }) => () => {
            setFormData(state => ({ ...state, 'isProfileVerified': !state.isProfileVerified }));
        }
    }),
    pure
);
export default UsersListHOC(UsersList);