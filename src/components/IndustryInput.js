import React from 'react';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { industriesQuery } from '../store/queries';

import SuggestionsInput from './SuggestionsInput';

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
    pure
)

const IndustryInput = props => {
    const { value, industriesQuery, ...other} = props;
    if (industriesQuery.loading)
        return <div>Industry...</div>;
    return (
        <SuggestionsInput
            suggestions={industriesQuery.industries}
            name='industry'
            label='Industry'
            placeholder='Enter industry...'
            className='textField'
            value={value || ''}
            getSuggestionValue={s => s ? s.title : ''}
            fullWidth
            {...other}
        />
    );
}

export default IndustryInputHOC(IndustryInput);