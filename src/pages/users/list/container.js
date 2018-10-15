import UsersList from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { profilesQuery } from '../../../store/queries';

const UsersListHOC = compose(
    withRouter,
    withState('searchData', 'setSearchData', {
        name: '',
        location: '',
        skills: [],
        values: [],
        companyName: '',
        // education
        isProfileVerified: false
    }),
    pure,
    graphql(profilesQuery, {
        name: 'profilesQuery',
        options: ({match, searchData: { name, location, skills, values, companyName, isProfileVerified }}) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: match.params.lang,
                filter: {
                    name,
                    location,
                    skills,
                    values,
                    companyName,
                    isProfileVerified
                },
                first: 10
            },
        }),
    })
);
export default UsersListHOC(UsersList);