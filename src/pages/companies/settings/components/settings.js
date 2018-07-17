import React from 'react';
import { Avatar, Button, TextField, FormLabel } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
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

import { s3BucketURL } from '../../../../constants/s3';
import { companyQuery, updateAvatarTimestampMutation, handleCompany } from '../../../../store/queries';

const SettingsHOC = compose(
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(handleCompany, { name: 'handleCompany' }),
    withState('isSaving', 'setIsSaving', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('settingsFormError', 'setSettingsFormError', ''),
    withState('settingsFormSuccess', 'setSettingsFormSuccess', false),
    withState('fileParams', 'setFileParams', {}),
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
        let { currentCompany: { company: { id, activityField, i18n, location, noOfEmployees, name } } } = props;
        if (!props.currentCompany || !props.currentCompany.company)
            return {};

        return { id, activityField, location, noOfEmployees, name };
    }),
    withHandlers({
        getSignedUrl: ({ formData, setFileParams }) => async (file, callback) => {
            const params = {
                fileName: file.name,
                contentType: file.type,
                id: formData.id,
                type: 'company_cover'
            };

            setFileParams(params);

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                callback(responseJson);
            }

            catch (error) {
                console.error(error);
                callback(error)
            }
        },
        onUploadStart: ({ setIsSaving }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setIsSaving(true);
                next(file);
            }
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: (props) => async () => {
            const { setIsSaving, handleCompany, updateAvatarTimestamp, match } = props;
            // await handleCompany({
            //     variables: {
            //         status: true
            //     },
            //     refetchQueries: [{
            //         query: currentUserQuery,
            //         fetchPolicy: 'network-only',
            //         name: 'currentUser',
            //         variables: {
            //             language: match.params.lang
            //         }
            //     }]
            // });
            // await updateAvatarTimestamp({
            //     variables: {
            //         timestamp: Date.now()
            //     }
            // });
            setIsSaving(false);
        },
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
                formData: { id, activityField, location, noOfEmployees, name },
                match,
                headline, description,
            } = props;

            setIsSaving(true);

            try {
                await handleCompany({
                    variables: {
                        language: match.params.lang,
                        details: {
                            id, activityField, location, noOfEmployees, name, headline, description
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
            }
            catch (err) {
                console.log(err)
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
        description, updateDescription
    } = props;
    const { name, location, activityField, noOfEmployees } = formData;

    let avatar = ''
    // (!localUserData.loading && currentUser.profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/${currentUser.profile.id}/avatar.${currentUser.profile.avatarContentType}?${localUserData.localUser.timestamp}` : null

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
            <div className='profilePicture'>
                <Avatar src={avatar} alt='profile picture' key={avatar} className='settingsAvatar' />
                <label htmlFor="uploadProfileImg">
                    <S3Uploader
                        id="uploadProfileImg"
                        name="uploadProfileImg"
                        className='hiddenInput'
                        getSignedUrl={getSignedUrl}
                        accept="image/*"
                        preprocess={onUploadStart}
                        onProgress={onProgress}
                        onError={onError}
                        onFinish={onFinishUpload}
                        uploadRequestHeaders={{
                            'x-amz-acl': 'public-read',
                        }}

                    />
                    <Button component='span' className='settingsUploadBtn' disabled={isSaving}>
                        Change company background
                    </Button>
                </label>
            </div>
            <div className='infoFields'>
                <TextField
                    name='activityField'
                    label='Activity field'
                    placeholder='Enter your activity field...'
                    className='textField'
                    onChange={handleFormChange}
                    value={activityField || ''}
                    type='text'
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