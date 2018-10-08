import React from 'react';
import { TextField } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { debounce } from 'lodash';
import { FormattedMessage } from 'react-intl'

import TagsInput from '../../../components/TagsInput';

// setSearchData is and must be defined higher in the hierarchy
const NewsFeedSearchHoc = compose(
    withState('searchFormData', 'setSearchFormData', ({searchData}) => ({
        ...searchData,
    })),
    withHandlers({
        getSearchFormData: ({ searchFormData, setSearchData }) => () => setSearchData(state => ({ ...state, ...searchFormData}))
    }),
    withState('debouncedSetSearchData', '', props => debounce(props.getSearchFormData, 2000)),
    withHandlers({
        handleSearchFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setSearchFormData(state => ({ ...state, [name]: value }), props.debouncedSetSearchData);
        },
        setTags: ({ setSearchFormData, debouncedSetSearchData }) => tags => setSearchFormData(state => ({ ...state, tags }), debouncedSetSearchData),
    }),
    pure
);

const NewsFeedSearch = props => {
    const { 
        searchFormData: { peopleOrCompany, tags }, handleSearchFormChange, setTags
    } = props;

    return (
        <section className='searchFields'>
            <FormattedMessage id="feed.peopleOrCompany" defaultMessage="Keywords, people or companies" description="Keywords, people or companies">
                {(text) => (
                    <TextField
                        name='peopleOrCompany'
                        label={text.split("\n")[0]}
                        placeholder={text.split("\n")[1]}
                        type="search"
                        className='searchField'
                        value={peopleOrCompany || ''}
                        onChange={handleSearchFormChange}
                        fullWidth
                    />
                )}
            </FormattedMessage>
            <FormattedMessage id="feed.hashTags" defaultMessage="#hashtags" description="Hash Tags">
                {(text) => (
                    <TagsInput 
                        label={text.split("\n")[0]}
                        placeholder={text.split("\n")[1]}
                        value={tags} onChange={setTags} helpTagName='tag' />
                )}
            </FormattedMessage>
            
        </section>
    );
}

export default NewsFeedSearchHoc(NewsFeedSearch);

