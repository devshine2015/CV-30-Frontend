import React from 'react';
import { Select, MenuItem, ListItemText } from '@material-ui/core';
import { compose, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { industriesQuery } from '../store/queries';

//import SuggestionsInput from './SuggestionsInput';

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

// const IndustryInput = props => {
//     const { value, industriesQuery, ...other} = props;
//     if (industriesQuery.loading)
//         return <div>Industry...</div>;
//     return (
//         <SuggestionsInput
//             suggestions={industriesQuery.industries}
//             name='industry'
//             label='Industry'
//             placeholder='Enter industry...'
//             className='textField'
//             value={value || ''}
//             getSuggestionValue={s => s ? s.title : ''}
//             fullWidth
//             {...other}
//         />
//     );
// }

const IndustryInput = props => {
    const { value, industriesQuery, staticContext, ...other} = props;
    if (industriesQuery.loading || !industriesQuery.industries)
        return <div>Industry...</div>;
    return (
        <Select
            label='Industry'
            placeholder='Enter industry...'
            className='textField'
            value={value || -1}
            {...other}
        >
            {industriesQuery.industries && industriesQuery.industries.map(item => (
                <MenuItem key={item.id} value={item.id}>
                    <FormattedMessage id={`industries.${item.key}`} defaultMessage={item.key}>
                        {(text) => <ListItemText primary={text} />}
                    </FormattedMessage>
                </MenuItem>
            ))}
        </Select>
    );
}

export default IndustryInputHOC(IndustryInput);