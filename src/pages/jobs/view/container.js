import Job from './component';
import { compose, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getJobQuery, getCurrentUser, getEditMode } from '../../../store/queries';

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
    graphql(getEditMode, { name: 'getEditMode' }),
    pure
);
export default JobHOC(Job);

