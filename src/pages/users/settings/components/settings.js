import React from 'react';
import { Avatar, Button, TextField } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { updateAvatar, localUserQuery, updateAvatarTimestampMutation, updateUserSettingsMutation, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';

const SettingsHOC = compose(
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(updateUserSettingsMutation, { name: 'updateUserSettings' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ currentProfileQuery: { profile: { firstName, lastName, email } } }) => ({
        isUploading: false,
        uploadProgress: 0,
        uploadError: null,
        settingsFormError: '',
        settingsFormSuccess: false,
        fileParams: {},
        formData: { firstName, lastName, email }
    })),
    withHandlers({
        getSignedUrl: ({ currentProfileQuery, state, setState, setFeedbackMessage }) => async (file, callback) => {
            const fileParams = {
                fileName: `avatar.${file.type.replace('image/', '')}`,
                contentType: file.type,
                id: currentProfileQuery.profile.id,
                type: 'avatar'
            };
            setState({ ...state, fileParams });

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fileParams)
                });
                let responseJson = await response.json();
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error || error.message
                    }
                });
            }
        },
        onUploadStart: ({ state, setState }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setState({ ...state, isUploading: true });
                next(file);
            }
        },
        onProgress: ({ state, setState }) => setUploadProgress => setState({ ...state, setUploadProgress }),
        onError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        onFinishUpload: ({ updateAvatar, updateAvatarTimestamp, match, state, setState, setFeedbackMessage }) => async data => {
            try {
                await updateAvatar({
                    variables: {
                        status: true,
                        contentType: state.fileParams.contentType.replace('image/', '')
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
                });
                await updateAvatarTimestamp({
                    variables: {
                        timestamp: Date.now()
                    }
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
            setState({ ...state, isUploading: false });
        },
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({ ...state, formData: { ...state.formData, [name]: value } });
        },
        saveUserDetails: ({ state, setState, updateUserSettings, match }) => async () => {
            const { formData: { firstName, lastName, oldPassword, newPassword, newPasswordConfirm } } = state;
            if (newPassword) {
                if (!oldPassword) { alert('Please enter your current password'); return; }
                if (newPassword !== newPasswordConfirm) { alert('New password and confirm new password do not match'); return; }
            }
            if (!firstName.trim()) {
                alert('First name cannot be empty');
                return;
            }
            if (!lastName.trim()) {
                alert('Last name cannot be empty');
                return;
            }
            if (newPassword === oldPassword && !!newPassword) {
                alert('Are you trying to change the current password with the same one?');
                return;
            }
            try {
                const { data: { updateUserSettings: { status } } } = await updateUserSettings({
                    variables: {
                        userSettings: {
                            firstName,
                            lastName,
                            oldPassword: oldPassword ? oldPassword : '',
                            newPassword: newPassword ? newPassword : ''
                        }
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
                });
                if (status) setState({ ...state, settingsFormSuccess: true });
            } catch (error) {
                setState({ ...state, settingsFormError: JSON.stringify(error) });
            }
        }
    }),
    pure
)
const Settings = props => {
    const {
        isUploading,
        settingsFormError,
        settingsFormSuccess,
        formData: { firstName, lastName, email, oldPassword, newPassword, newPasswordConfirm }
    } = props.state
    const { getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, localUserData, currentProfileQuery, handleFormChange, saveUserDetails } = props;

    const { profile } = currentProfileQuery;
    let avatar =
        (!localUserData.loading && profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/${profile.id}/avatar.${profile.avatarContentType}?${localUserData.localUser.timestamp}` : null

    return (
        <div className='settingsTab'>
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
                    <Button component='span' className='settingsUploadBtn' disabled={isUploading}>
                        Change profile picture
                    </Button>
                </label>
            </div>
            <div className='infoFields'>
                <TextField
                    name='firstName'
                    label='First name'
                    placeholder='Enter your first name...'
                    className='textField'
                    onChange={handleFormChange}
                    value={firstName || ''}
                    type='text'
                />
                <TextField
                    name='lastName'
                    label='Last name'
                    placeholder='Enter your last name...'
                    className='textField'
                    onChange={handleFormChange}
                    value={lastName || ''}
                    type='text'
                />
                <TextField
                    name='email'
                    label='Email'
                    placeholder='Enter your email...'
                    className='textField'
                    onChange={handleFormChange}
                    value={email || ''}
                    type='email'
                    disabled
                />
            </div>
            <div className='passwordFields'>
                <TextField
                    name='oldPassword'
                    label='Old password'
                    placeholder='Enter your old password...'
                    className='textField'
                    onChange={handleFormChange}
                    value={oldPassword || ''}
                    type='password'
                />
                <TextField
                    name='newPassword'
                    label='New password'
                    placeholder='Enter your new password...'
                    className='textField'
                    onChange={handleFormChange}
                    value={newPassword || ''}
                    type='password'
                />
                <TextField
                    name='newPasswordConfirm'
                    label='Confirm new password'
                    placeholder='Confirm new password...'
                    className='textField'
                    onChange={handleFormChange}
                    value={newPasswordConfirm || ''}
                    type='password'
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