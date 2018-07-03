import CompaniesList from './component';
import { compose, pure } from 'recompose';
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
    pure
);

export default CompaniesListHOC(CompaniesList);