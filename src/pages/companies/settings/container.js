import CompanySettings from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

import { companyQuery, setEditMode } from '../../../store/queries';

const CompanySettingsHOC = compose(
    graphql(companyQuery, {
        name: 'currentCompany',
        options: (props) => ({
            variables: {
                language: props.match.params.lang,
                id: props.match.params.companyId
            },
            fetchPolicy: 'network-only'
        }),
    }),
    graphql(setEditMode, { name: 'setEditMode' }),
    withState('activeTab', 'setActiveTab', props => {
        return props.location.state && props.location.state.activeTab ? props.location.state.activeTab : 'settings';
    }),
    withHandlers({
        handleTabChange: ({ setActiveTab }) => (event, value) => {
            setActiveTab(value);
        },
        editJob: ({ setEditMode, history, match: { params: { lang } } }) => async jobId => {
            await setEditMode({
                variables: {
                    status: true
                }
            });
            return history.push(`/${lang}/job/${jobId}`);
        }
    }),
    pure
);

export default CompanySettingsHOC(CompanySettings);