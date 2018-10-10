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

import { updateAvatarTimestampMutation, handleCompany, setFeedbackMessage } from '../../../../store/queries';
import { companyRefetch } from '../../../../store/refetch';

import IndustryInput from '../../../../components/IndustryInput';
import LocationInput from '../../../../components/LocationInput';

const SettingsHOC = compose(
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(handleCompany, { name: 'handleCompany' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ currentCompany: { company: { id, industry, location, noOfEmployees, name, headline, description } } }) => ({
        isSaving: false,
        settingsFormError: '',
        settingsFormSuccess: false,
        headline: headline ? headline : undefined,
        description: description ? description : undefined,
        formData: { id, industryId: industry ? industry.id : undefined, location, noOfEmployees, name }
    })),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setState({
                ...props.state,
                formData: {
                    ...props.state.formData,
                    [name]: value
                }
            });
        },
        updateHeadline: ({ state, setState }) => headline => setState({ ...state, headline }),
        updateDescription: ({ state, setState }) => description => setState({ ...state, description }),
        saveCompanyDetails: props => async () => {
            const {
                handleCompany, state, setState, match, setFeedbackMessage
            } = props;
            const { headline, description, formData: { id, industryId, location, noOfEmployees, name } } = state;
            setState({ ...state, isSaving: true });

            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: {
                            id, industryId, location, noOfEmployees, name, headline, description
                        }
                    },
                    refetchQueries: [
                        companyRefetch(id, match.params.lang)
                    ]
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
            setState({ ...state, isSaving: false });
        }
    }),
    pure
)

const Settings = props => {
    const {
        state: {
            settingsFormError,
            settingsFormSuccess,
            headline,
            description,
            formData: { name, location, industryId, noOfEmployees }
        },
        handleFormChange,
        saveCompanyDetails,
        updateHeadline,
        updateDescription
    } = props;

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
                <IndustryInput
                    className='textField'
                    updateFormState={val => handleFormChange({ target: { name: val[0].field, value: val[0].value }})}
                    value={industryId}
                    // schema={this.validation.industryId}
                />

                <LocationInput
                    className='textField'
                    updateFormState={val => handleFormChange({ target: { name: val[0].field, value: val[0].value }})}
                    value={location}
                    // schema={this.validation.location}
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
                <Button className='saveBtn' onClick={saveCompanyDetails}>Save</Button>
            </div>
        </div>
    );
}

export default SettingsHOC(Settings);