import JobsList from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { getJobsQuery } from '../../../store/queries';
import { withRouter } from 'react-router-dom';

const JobsListHOC = compose(
    withRouter,
    graphql(getJobsQuery, {
        name: 'getJobsQuery',
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
        handleSliderChange: () => (value) => {
            console.log(value);
        },
        handleSearchJobs: props => event => console.log(props.formData)
    }),
    pure
);

export default JobsListHOC(JobsList);