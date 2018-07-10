import Job from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const JobHOC = compose(
    withRouter,
    withState('editMode', 'updateEditMode', false),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);
export default JobHOC(Job);

