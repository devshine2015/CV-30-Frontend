import CompaniesList from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { companiesQuery } from '../../../store/queries';

const CompaniesListHOC = compose(
    withRouter,
    graphql(companiesQuery, {
        name: 'companiesQuery',
        fetchPolicy: 'network-only',
        options: props => ({
            variables: {
                language: props.match.params.lang
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
        }
    }),
    pure
);

export default CompaniesListHOC(CompaniesList);