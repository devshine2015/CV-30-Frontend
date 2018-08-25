import React from 'react';
import { TextField } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { debounce } from 'lodash';

import TagsInput from '../../../components/TagsInput';

// setSearchData is and must be defined higher in the hierarchy
const NewsFeedSearchHoc = compose(
    withState('searchFormData', 'setSearchFormData', ({searchData}) => ({
        ...searchData,
    })),
    withHandlers({
        getSearchFormData: ({ searchFormData, setSearchData }) => () => {
            setSearchData(state => ({ ...state, ...searchFormData}))
        }
    }),
    withState('debouncedSetSearchData', '', ({ getSearchFormData }) => {
        return debounce(getSearchFormData, 2000);
    }),
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
            <TextField
                name='peopleOrCompany'
                label='Keywords, people or companies'
                placeholder='Search for keywords, people or companies...'
                type="search"
                className='textField'
                value={peopleOrCompany || ''}
                onChange={handleSearchFormChange}
                fullWidth
            />
            <TagsInput 
                label='#hashtags'
                placeholder='Search for hastags...'
                value={tags} onChange={setTags} helpTagName='tag' />
        </section>
    );
}

export default NewsFeedSearchHoc(NewsFeedSearch);

