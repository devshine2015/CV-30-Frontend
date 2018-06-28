import Job from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

const JobHOC = compose(
    withRouter,
    withState('editMode', 'updateEditMode', true),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);
export default JobHOC(Job);

