import React from 'react';
import { FormattedMessage } from 'react-intl'
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
<<<<<<< HEAD
        <FormattedMessage id="location.placeHolder" defaultMessage="Location\nEnter location..." description="Enter location">
            {(text) => (
                <AutoCompleteSelectInput
                    value={suggestions.find(el => el.value === value) || ''}
                    onChange={val => onChange({
                        target: {
                            value: val.value,
                            name
                        }
                    })}
                    suggestions={suggestions}
                    placeholder={text.split("\n")[1]}
                    label={text.split("\n")[0]}
                />
            )}
        </FormattedMessage>
        
=======
        <div className={props.className}>
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
                async
            />
        </div>
>>>>>>> f2ecd3fffbdd21dd7d63f95ca82fb2d7f97224b9
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