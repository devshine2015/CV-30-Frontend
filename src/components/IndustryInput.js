import React from 'react';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { injectIntl, FormattedMessage } from 'react-intl';

import { industriesQuery } from '../store/queries';
import  { AutoSuggestField } from './FormHOCs';

const IndustryInputHOC = compose(
    withRouter,
    graphql(industriesQuery, {
        name: 'industriesQuery',
        options: ({ match}) => ({
            variables: {
                language: match.params.lang,
            },
            fetchPolicy: 'network-only'
        }),
    }),
    injectIntl,
    pure
)

const IndustryInput = props => {
    const { industriesQuery } = props;

    if (industriesQuery.loading || !industriesQuery.industries) {
        return (
            <FormattedMessage id="industry.loading" defaultMessage="Industry..." description="Industry">
                {(text) => (
                    <div>{text}</div>
                )}
            </FormattedMessage> 
        );
    }

    const { intl } = props;

    const suggestions = industriesQuery.industries.map(industry => ({
        value: industry.id,
        label: intl.formatMessage({ id: `industries.${industry.key}` })
    }));
    
    return (
        <AutoSuggestField
            {...props}
            suggestions={suggestions}
            name={props.name || 'industryId'}
            i18nId={props.i18nId || 'industry.inputTexts'}
        />
    )
}

export default IndustryInputHOC(IndustryInput);