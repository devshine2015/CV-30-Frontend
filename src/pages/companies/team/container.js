import Team from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { queryTeam } from '../../../store/queries';
import { graphql } from '../../../../node_modules/react-apollo';


const TeamHOC = compose(
    withRouter,
    graphql(queryTeam,
        {
            name: 'queryTeam',
            options: props => ({
                variables: {
                    id: props.match.params.teamId,
                    language: props.match.params.lang
                },
                fetchPolicy: 'network-only'
            })
        }),
    withState('editMode', 'updateEditMode', props => {
        return (props.location.state && props.location.state.editMode) ? props.location.state.editMode : false;
    }),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);
export default TeamHOC(Team);
