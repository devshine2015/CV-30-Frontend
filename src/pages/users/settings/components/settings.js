import React from 'react';
import { Avatar, Button, TextField } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { profileQuery, updateAvatar, localUserQuery, updateAvatarTimestampMutation, updateUserSettingsMutation, setFeedbackMessage } from '../../../../store/queries';

const SettingsHOC = compose(
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(updateUserSettingsMutation, { name: 'updateUserSettings' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),

    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('settingsFormError', 'setSettingsFormError', ''),
    withState('settingsFormSuccess', 'setSettingsFormSuccess', false),
    withState('fileParams', 'setFileParams', {}),
    withState('formData', 'setFormData', ({ currentUser }) => {
        if (!currentUser || !currentUser.profile)
            return {};
        let { firstName, lastName, email } = currentUser.profile;
        return { firstName, lastName, email };
    }),
    withHandlers({
        getSignedUrl: ({ currentUser, setFileParams, setFeedbackMessage }) => async (file, callback) => {
            const params = {
                fileName: `avatar.${file.type.replace('image/', '')}`,
                contentType: file.type,
                id: currentUser.profile.id,
                type: 'avatar'
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
        onUploadStart: ({ setIsUploading }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setIsUploading(true);
                next(file);
            }
        },
        onProgress: ({ setUploadProgress }) => (percent) => {
            setUploadProgress(percent);
        },
        onError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        onFinishUpload: (props) => async data => {
            const { setIsUploading, updateAvatar, updateAvatarTimestamp, match, fileParams: { contentType }, setFeedbackMessage } = props;
            try {
                await updateAvatar({
                    variables: {
                        status: true,
                        contentType: contentType.replace('image/', '')
                    },
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: match.params.lang
                        }
                    }]
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
            setIsUploading(false);
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
        saveUserDetails: ({ setSettingsFormSuccess, setSettingsFormError, updateUserSettings, formData: { firstName, lastName, oldPassword, newPassword, newPasswordConfirm }, match }) => async () => {
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
                    refetchQueries: [{
                        query: profileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentProfileQuery',
                        variables: {
                            language: match.params.lang
                        }
                    }]
                });
                if (status) setSettingsFormSuccess(true);
            } catch (error) {
                setSettingsFormError(JSON.stringify(error));
            }
        }
    }),
    pure
)
const Settings = props => {
    const { settingsFormSuccess, settingsFormError, getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading, localUserData, currentUser, handleFormChange, formData, saveUserDetails } = props;
    const { firstName, lastName, email, oldPassword, newPassword, newPasswordConfirm } = formData;

    let avatar =
        (!localUserData.loading && currentUser.profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/${currentUser.profile.id}/avatar.${currentUser.profile.avatarContentType}?${localUserData.localUser.timestamp}` : null

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