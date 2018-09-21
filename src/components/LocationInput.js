import React from 'react';

//import SuggestionsInput from './SuggestionsInput';
import AutoCompleteSelectInput from './AutoCompleteSelectInput';
import locations from '../constants/locations';

const LocationInput = props => {
    const name = props.name || 'location';
    const { value, onChange } = props;

    const suggestions = locations.map(item => ({
        value: item,
        label: item
    }));
    //console.log(props, suggestions, suggestions.find(el => el.value === value));

    return (
        <AutoCompleteSelectInput
            value={suggestions.find(el => el.value === value) || ''}
            onChange={val => onChange({
                target: {
                    value: val.value,
                    name
                }
            })}
            suggestions={suggestions}
            placeholder='Enter location...'
            label='Location'
        />
        // <SuggestionsInput
        //     suggestions={locations}
        //     name='location'
        //     label='Location'
        //     placeholder='Enter location...'
        //     className='textField'
        //     value={value || ''}
        //     getSuggestionValue={s => s}
        //     fullWidth
        //     {...other}
        // />
    );
}

export default LocationInput;