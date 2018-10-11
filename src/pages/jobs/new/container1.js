import NewJob from './component1';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql, withApollo } from 'react-apollo';
import uuid from 'uuidv4';
import { withRouter } from 'react-router-dom';
// import { withFormik } from 'formik';

import { jobDependencies, handleJob, setFeedbackMessage, setEditMode } from '../../../store/queries';
import { jobsFolder } from '../../../constants/s3';
import { jobValidation } from './validations';

const NewJobHOC = compose(
    withRouter,
    withApollo,
    graphql(jobDependencies, {
        name: 'jobDependencies',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                companyId: props.location.state.companyId
            }
        })
    }),
    graphql(handleJob, { name: 'handleJob' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(setEditMode, { name: 'setEditMode' }),
    pure
);

export default NewJobHOC(NewJob);