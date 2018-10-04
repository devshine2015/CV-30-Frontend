import React from 'react';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { injectIntl, FormattedMessage } from 'react-intl';
import { industriesQuery } from '../store/queries';

import AutoCompleteSelectInput from './AutoCompleteSelectInput';

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

    if (industriesQuery.loading || !industriesQuery.industries) return <FormattedMessage id="industry.loading" defaultMessage="Industry..." description="Industry">
                                                                            {(text) => (
                                                                                <div>{text}</div>
                                                                            )}
                                                                        </FormattedMessage> 

    const name = props.name || 'industryId';
    const { value, onChange, intl } = props;

    const suggestions = industriesQuery.industries.map(industry => ({
        value: industry.id,
        label: intl.formatMessage({ id: `industries.${industry.key}` })
    }));
    
    return (
        <FormattedMessage id="industry.placeHolder" defaultMessage="Enter industry..." description="Enter industry">
            {(text) => (
                <AutoCompleteSelectInput
                    value={suggestions.find(el => el.value === value)}
                    onChange={val => onChange({
                        target: {
                            value: val.value,
                            name
                        }
                    })}
                    suggestions={suggestions}
                    placeholder={text}
                    label='Industry'
                />
            )}
        </FormattedMessage>
        
    )
}


export default IndustryInputHOC(IndustryInput);