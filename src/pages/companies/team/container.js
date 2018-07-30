import Team from './component';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { queryTeam, getCurrentUser, getEditMode } from '../../../store/queries';


const TeamHOC = compose(
    withRouter,
    graphql(queryTeam, {
        name: 'queryTeam',
        options: props => ({
            variables: {
                id: props.match.params.teamId,
                language: props.match.params.lang
            },
            fetchPolicy: 'network-only'
        })
    }),
    graphql(getCurrentUser, {
        name: 'currentUser'
    }),
    graphql(getEditMode, { name: 'getEditMode' }),
    pure
);
export default TeamHOC(Team);
