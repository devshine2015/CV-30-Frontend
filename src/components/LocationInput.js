import React from 'react';

import SuggestionsInput from './SuggestionsInput';
import locations from '../constants/locations';

const LocationInput = props => {
    const { value, ...other} = props;
    return (
        <SuggestionsInput
            suggestions={locations}
            name='location'
            label='Location'
            placeholder='Enter location...'
            className='textField'
            value={value || ''}
            getSuggestionValue={s => s}
            fullWidth
            {...other}
        />
    );
}

export default LocationInput;