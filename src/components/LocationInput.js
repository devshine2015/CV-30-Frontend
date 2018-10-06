import React from 'react';
import { FormattedMessage } from 'react-intl'
//import SuggestionsInput from './SuggestionsInput';
import AutoCompleteSelectInput from './AutoCompleteSelectInput';
import suggestions from '../constants/locations';
import { pure } from 'recompose';

const LocationInput = props => {
    const name = props.name || 'location';
    const { value, onChange } = props;

    //console.log(props, suggestions, suggestions.find(el => el.value === value));

    return (
        <FormattedMessage id="location.inputTexts" defaultMessage="Location\nEnter location..." description="Enter location">
            {(text) => (
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
                        placeholder={text.split("\n")[1]}
                        label={text.split("\n")[0]}
                        async
                    />
                </div>
            )}
        </FormattedMessage>
        
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

export default pure(LocationInput);