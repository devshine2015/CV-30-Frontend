import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import { companyQuery, updateAvatarTimestampMutation, handleCompany, setFeedbackMessage, industriesQuery } from '../../../../store/queries';

import Loader from '../../../../components/Loader';
import SuggestionsInput from '../../../../components/SuggestionsInput';

const SettingsHOC = compose(
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    graphql(industriesQuery, {
        name: 'industriesQuery',
        options: ({ match}) => ({
            variables: {
                language: match.params.lang,
            },
            fetchPolicy: 'network-only'
        }),
    }),
    withState('isSaving', 'setIsSaving', false),
    withState('settingsFormError', 'setSettingsFormError', ''),
    withState('settingsFormSuccess', 'setSettingsFormSuccess', false),
    withState('headline', 'setHeadline', props => {
        let { currentCompany: { company: { i18n } } } = props;

        if (!i18n || !i18n[0] || !i18n[0].headline)
            return '';
        return i18n[0].headline;

    }),
    withState('description', 'setDescription', props => {
        let { currentCompany: { company: { i18n } } } = props;

        if (!i18n || !i18n[0] || !i18n[0].description)
            return '';
        return i18n[0].description;

    }),
    withState('formData', 'setFormData', props => {
        let { currentCompany: { company: { id, industry, location, noOfEmployees, name } } } = props;
        if (!props.currentCompany || !props.currentCompany.company)
            return {};

        return { id, industry: industry ? industry.i18n[0].title : '', location, noOfEmployees, name };
    }),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        updateHeadline: ({ setHeadline }) => text => setHeadline(text),
        updateDescription: ({ setDescription }) => text => setDescription(text),
        saveUserDetails: props => async () => {
            const {
                handleCompany, setIsSaving,
                setSettingsFormSuccess, setSettingsFormError, updateUserSettings,
                formData: { id, industry, location, noOfEmployees, name },
                match,
                headline, description,
                setFeedbackMessage
            } = props;

            setIsSaving(true);

            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: {
                            id, industry, location, noOfEmployees, name, headline, description
                        }
                    },
                    refetchQueries: [{
                        query: companyQuery,
                        fetchPolicy: 'network-only',
                        name: 'companyQuery',
                        variables: {
                            language: match.params.lang,
                            id: id
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                console.log(err);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        }
    }),
    pure
)

const Settings = props => {
    const {
        settingsFormSuccess, settingsFormError,
        getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isSaving,
        handleFormChange, formData,
        saveUserDetails,
        headline, updateHeadline,
        description, updateDescription,
        industriesQuery
    } = props;
    const { name, location, industry, noOfEmployees } = formData;

    if (industriesQuery.loading)
        return <Loader/>;

    return (
        <div className='settingsTab'>
            <div className='companyName'>
                <TextField
                    name='name'
                    label='Company name'
                    placeholder='Enter your company name...'
                    className='textField'
                    onChange={handleFormChange}
                    value={name || ''}
                    type='text'
                    fullWidth
                    InputProps={{
                        classes: {
                            input: 'titleInput',
                        }
                    }}
                />
            </div>
            <div className='infoFields'>
                <SuggestionsInput
                    suggestions={industriesQuery.industries}
                    name='industry'
                    label='Industry'
                    placeholder='Enter your industry...'
                    className='textField'
                    onChange={handleFormChange}
                    value={industry || ''}
                    getSuggestionValue={s => s ? s.i18n[0].title : ''}
                />

                <TextField
                    name='location'
                    label='Location'
                    placeholder='Enter your location...'
                    className='textField'
                    onChange={handleFormChange}
                    value={location || ''}
                    type='text'
                />
                <TextField
                    name='noOfEmployees'
                    label='Number of noOfEmployees'
                    placeholder='Number of noOfEmployees...'
                    className='textField'
                    onChange={handleFormChange}
                    value={noOfEmployees || ''}
                    type='text'
                />
            </div>
            <div className='textArea headline'>
                <p className='label'>Company headline</p>
                <FroalaEditor
                    config={{
                        placeholderText: 'This is where the company headline should be',
                        iconsTemplate: 'font_awesome_5',
                        toolbarInline: true,
                        charCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                    }}
                    model={headline}
                    onModelChange={updateHeadline}
                />
            </div>
            <div className='textArea description'>
                <p className='label'>Company description</p>
                <FroalaEditor
                    config={{
                        placeholderText: 'This is where the company description should be',
                        iconsTemplate: 'font_awesome_5',
                        toolbarInline: true,
                        charCounterCount: false,
                        toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'color', '-', 'paragraphFormat', 'align', 'formatOL', 'indent', 'outdent', '-', 'undo', 'redo']
                    }}
                    model={description}
                    onModelChange={updateDescription}
                />
            </div>
            <div className='actions'>
                {/* <Button className='cancelBtn'>Cancel</Button> */}
                {settingsFormError && <div className="errorMessage">{settingsFormError}</div>}
                {settingsFormSuccess && <div className="successMessage">Your details have been successfully saved</div>}
                <Button className='saveBtn' onClick={saveUserDetails}>Save</Button>
            </div>
        </div>
    );
}

export default SettingsHOC(Settings);