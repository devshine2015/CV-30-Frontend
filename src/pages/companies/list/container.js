import CompaniesList from './component';
import { compose, pure, withState } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { companiesQuery } from '../../../store/queries';

const CompaniesListHOC = compose(
    withRouter,
    withState('searchData', 'setSearchData', {
        name: '',
        location: '',
        industryId: undefined,
        teamId: undefined,
        //companyTypes: []
    }),
    pure,
    graphql(companiesQuery, {
        name: 'companiesQuery',
        options: ({ match, searchData: { name, location, industryId, teamId}}) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: match.params.lang,
                filter: {
                    name,
                    location,
                    industryId,
                    teamId
                },
                first: 10
            },
        }),
    })
);

export default CompaniesListHOC(CompaniesList);