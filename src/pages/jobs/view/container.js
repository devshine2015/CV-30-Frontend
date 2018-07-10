import Job from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { getJobQuery } from '../../../store/queries';
import { withRouter } from 'react-router-dom';

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
    withState('editMode', 'updateEditMode', false),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);
export default JobHOC(Job);

