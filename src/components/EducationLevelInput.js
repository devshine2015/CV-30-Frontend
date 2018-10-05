import React from 'react';
import { FormattedMessage } from 'react-intl';
//import SuggestionsInput from './SuggestionsInput';
import AutoCompleteSelectInput from './AutoCompleteSelectInput';
import levels from '../constants/educationLevels';

const EducationLevelInput = props => {
    const name = props.name || 'position';
    const { value, onChange } = props;

    const suggestions = levels.map(item => ({
        value: item,
        label: item
    }));
    //console.log(props, suggestions, suggestions.find(el => el.value === value));

    return (
        <FormattedMessage id="education.addLevel" defaultMessage="Enter Education Level..." description="Enter Education Level">
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
                    placeholder={text}
                    label='Level'
                />
            )}
        </FormattedMessage>
        
        // <SuggestionsInput
        //     suggestions={levels}
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

export default EducationLevelInput;