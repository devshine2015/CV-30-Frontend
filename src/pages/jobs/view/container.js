import Job from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getJobQuery, getCurrentUser } from '../../../store/queries';

const JobHOC = compose(
    withRouter,
    graphql(getJobQuery, {
        name: 'getJobQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                id: props.match.params.jobId,
                language: props.match.params.lang
            },
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
export default JobHOC(Job);

