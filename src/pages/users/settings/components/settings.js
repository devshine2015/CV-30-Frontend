import React from 'react';
import { Grid, Avatar, Button, TextField } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { currentUserQuery, updateAvatar, localUserQuery, updateAvatarTimestampMutation, updateUserSettingsMutation } from '../../../../store/queries';

const SettingsHOC = compose(
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(updateUserSettingsMutation, { name: 'updateUserSettings' }),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('settingsFormError', 'setSettingsFormError', ''),
    withState('settingsFormSuccess', 'setSettingsFormSuccess', false),
    withState('formData', 'setFormData', ({ currentUser }) => {
        if (!currentUser || !currentUser.profile)
            return {};
        let { firstName, lastName, email } = currentUser.profile;
        return { firstName, lastName, email };
    }),
    withHandlers({
        getSignedUrl: ({ currentUser }) => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type,
                id: currentUser.profile.id,
                type: 'avatar'
            };

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
                callback(error)
            }
        },
        renameFile: () => filename => {
            let getExtension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');
            return fName;
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
        onError: ({ setUploadError }) => error => {
            setUploadError(error);
            console.log(error);
        },
        onFinishUpload: (props) => async () => {
            const { setIsUploading, updateAvatar, updateAvatarTimestamp } = props;
            await updateAvatar({
                variables: {
                    status: true
                },
                refetchQueries: [{
                    query: currentUserQuery,
                    fetchPolicy: 'network-only',
                    name: 'currentUser',
                    variables: {
                        language: 'en',
                        id: null
                    }
                }]
            });
            await updateAvatarTimestamp({
                variables: {
                    timestamp: Date.now()
                }
            });
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
        saveUserDetails: ({ setSettingsFormSuccess, setSettingsFormError, updateUserSettings, formData: { firstName, lastName, oldPassword, newPassword, newPasswordConfirm } }) => async () => {
            if (newPassword) {
                if (!oldPassword) { alert('Please enter your current password'); return; }
                if (newPassword != newPasswordConfirm) { alert('New password and confirm new password do not match'); return; }
            }
            if (!firstName.trim()) { alert('First name cannot be empty'); return; }
            if (!lastName.trim()) { alert('Last name cannot be empty'); return; }
            if (newPassword == oldPassword && !!newPassword) { alert('Are you trying to change the current password with the same one?'); return; }
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
                        query: currentUserQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en',
                            id: null
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
        (!localUserData.loading && currentUser.profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/${currentUser.profile.id}/avatar.png?${localUserData.localUser.timestamp}` : null

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
                { settingsFormError && <div className="errorMessage">{ settingsFormError }</div> }
                { settingsFormSuccess && <div className="successMessage">Your details have been successfully saved</div> }
                <Button className='saveBtn' onClick={saveUserDetails}>Save</Button>
            </div>
        </div>
    );
}

export default SettingsHOC(Settings);