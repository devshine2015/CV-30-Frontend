import CompanySettings from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

import { getCompanyQuery } from '../../../store/queries';

const CompanySettingsHOC = compose(
    graphql(getCompanyQuery, {
        name: 'currentCompany',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: props.match.params.companyId
            },
            fetchPolicy: 'network-only'
        }),
    }),
    withState('activeTab', 'setActiveTab', props => {
        return props.location.state && props.location.state.activeTab ? props.location.state.activeTab : 'settings';
    }),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        }
    }),
    pure
);

export default CompanySettingsHOC(CompanySettings);