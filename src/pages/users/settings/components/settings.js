import React from 'react';
import { Avatar, Button, TextField } from '@material-ui/core';
// import S3Uploader from 'react-s3-uploader';
import { compose, withState, withHandlers, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { updateAvatar, localUserQuery, deleteAccountMutation, updateAvatarTimestampMutation, updateUserSettingsMutation, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import ImageUploader from '../../../../components/imageUploader';

const SettingsHOC = compose(
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    graphql(updateUserSettingsMutation, { name: 'updateUserSettings' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ currentProfileQuery: { profile: { firstName, lastName, email } } }) => ({
        isTerminatingAccount: false,
        imageUploadOpen: false,
        // isUploading: false,
        // uploadProgress: 0,
        uploadError: null,
        settingsFormError: '',
        settingsFormSuccess: false,
        fileParams: {},
        formData: { firstName, lastName, email }
    })),
    withHandlers({
        toggleClose: ({ setState }) => () => setState(state => ({ ...state, isTerminatingAccount: !state.isTerminatingAccount })),
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
        /*onUploadStart: ({ state, setState }) => (file, next) => {
            let size = file.size;
            if (size > 500 * 1024) {
                alert('File is too big!');
            } else {
                setState({ ...state, isUploading: true });
                next(file);
            }
        },*/
        // onProgress: ({ state, setState }) => setUploadProgress => setState({ ...state, setUploadProgress }),
        openImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: true }),
        closeImageUpload: ({ state, setState }) => () => setState({ ...state, imageUploadOpen: false }),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({
            setFeedbackMessage, updateAvatar, updateAvatarTimestamp, match,
            currentProfileQuery: { profile: { id: profileId } } }) =>
            async data => {
                const { path, filename } = data;
                const avatarPath = path ? path : `/${profilesFolder}/${profileId}/${filename}`;
                try {
                    await updateAvatar({
                        variables: {
                            status: true,
                            path: avatarPath
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
        },
        /*onError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        /*onFinishUpload: ({ updateAvatar, updateAvatarTimestamp, match, state, setState, setFeedbackMessage }) => async data => {
            debugger;
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
        },*/
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
        // isUploading,
        settingsFormError,
        settingsFormSuccess,
        isTerminatingAccount,
        imageUploadOpen,
        formData: { firstName, lastName, email, oldPassword, newPassword, newPasswordConfirm }
    } = props.state
    const { openImageUpload, toggleClose, closeImageUpload, handleError, handleSuccess, localUserData, currentProfileQuery, handleFormChange, saveUserDetails } = props;

    const { profile } = currentProfileQuery;
    // let avatar = (!localUserData.loading && profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/${profile.id}/avatar.${profile.avatarContentType}?${localUserData.localUser.timestamp}` : null
    let avatar = (!localUserData.loading && profile.avatarPath) ? `${s3BucketURL}${profile.avatarPath}?${localUserData.localUser.timestamp}` : null;

    return (
        <div className='settingsTab'>
            <div className='profilePicture'>
                <Avatar src={avatar} alt='profile picture' key={avatar} className='settingsAvatar' />
                <label htmlFor="uploadProfileImg">
                    <ImageUploader
                        type='profile_avatar'
                        open={imageUploadOpen}
                        onClose={closeImageUpload}
                        onError={handleError}
                        onSuccess={handleSuccess}
                        id={profile.id}
                    />
                    {/* <S3Uploader
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

                    /> */}
                    <FormattedMessage id="users.changePicture" defaultMessage="Change profile picture" description="Change profile picture">
                        {(text) => (
                            <Button component='span' className='settingsUploadBtn' disabled={imageUploadOpen} onClick={openImageUpload}>
                                {text}
                            </Button>
                        )}
                    </FormattedMessage>
                    
                </label>
            </div>
            <FormattedMessage id="users.infoFields" defaultMessage="First name\nEnter your first name...\nLast name\nEnter your last name...\nEmail\nEnter your email..." description="">
                {(text) => (
                    <div className='infoFields'>
                        <TextField
                            name='firstName'
                            label={text.split("\n")[0]}
                            placeholder={text.split("\n")[1]}
                            className='textField'
                            onChange={handleFormChange}
                            value={firstName || ''}
                            type='text'
                        />
                        <TextField
                            name='lastName'
                            label={text.split("\n")[2]}
                            placeholder={text.split("\n")[3]}
                            className='textField'
                            onChange={handleFormChange}
                            value={lastName || ''}
                            type='text'
                        />
                        <TextField
                            name='email'
                            label={text.split("\n")[4]}
                            placeholder={text.split("\n")[5]}
                            className='textField'
                            onChange={handleFormChange}
                            value={email || ''}
                            type='email'
                            disabled
                        />
                    </div>
                )}
            </FormattedMessage>
            <FormattedMessage id="users.passwordFields" defaultMessage="Old password\nEnter your old password...\nNew password\nEnter your new password...\nConfirm new password\nConfirm new password..." description="Password Fields">
                {(text) => (
                    <div className='passwordFields'>
                        <TextField
                            name='oldPassword'
                            label={text.split("\n")[0]}
                            placeholder={text.split("\n")[1]}
                            className='textField'
                            onChange={handleFormChange}
                            value={oldPassword || ''}
                            type='password'
                        />
                        <TextField
                            name='newPassword'
                            label={text.split("\n")[2]}
                            placeholder={text.split("\n")[3]}
                            className='textField'
                            onChange={handleFormChange}
                            value={newPassword || ''}
                            type='password'
                        />
                        <TextField
                            name='newPasswordConfirm'
                            label={text.split("\n")[4]}
                            placeholder={text.split("\n")[5]}
                            className='textField'
                            onChange={handleFormChange}
                            value={newPasswordConfirm || ''}
                            type='password'
                        />
                    </div>
                )}
            </FormattedMessage>
            
            <div className='actions'>
                <FormattedMessage id="userProfile.deleteAccount" defaultMessage="Delete Account" description="Click here to terminate your account">
                    {(text) => <div className='deleteAccount' onClick={toggleClose}>{text}</div>}
                </FormattedMessage>
                {settingsFormError && <div className="errorMessage">{settingsFormError}</div>}
                <FormattedMessage id="users.saveSuccess" defaultMessage="Your details have been successfully saved" description="Your details have been successfully saved">
                    {(text) => (
                        settingsFormSuccess && <div className="successMessage">{text}</div>
                    )}
                </FormattedMessage>
                <FormattedMessage id="users.save" defaultMessage="Save" description="Save">
                    {(text) => (
                        <Button className='saveBtn' onClick={saveUserDetails}>{text}</Button>
                    )}
                </FormattedMessage>
                
            </div>
            <AccountTermination handleClose={toggleClose} open={isTerminatingAccount} />
        </div>
    );
}

const AccountTermination = compose(
    withRouter,
    withApollo,
    withState('confirmation', 'set', ''),
    graphql(deleteAccountMutation, { name: 'deleteAccount' }),
    withHandlers({
        onClose: ({ handleClose }) => () => handleClose(),
        handleChange: ({ set }) => event => set(event.target.value),
        closeAccount: ({ deleteAccount, client, history }) => async () => {
            try {
                const { data: { deleteProfile: { status } } } = await deleteAccount();
                if (status) { 
                    client.resetStore();
                    history.push("/");
                }
            } catch(error) { console.log(error); }
        }
    }),
    pure
)(({ open, onClose, confirmation, handleChange, closeAccount }) => (
    <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        >
        <FormattedMessage id="userProfile.deleteAccount" defaultMessage="Delete Account" description="Click here to terminate your account">
            {(text) => <DialogTitle id="form-dialog-title">{text}</DialogTitle>}
        </FormattedMessage>
        <DialogContent>
            <FormattedMessage id="userProfile.deleteAccountConfrimationText" defaultMessage="Delete Account Confirmation" description="Please confirm you want to delete your account">
                {(text) => <DialogContentText>{text}</DialogContentText>}
            </FormattedMessage>
            <TextField margin="dense" id="confirmation" value={confirmation} onChange={handleChange} label="confirmation" type="text" fullWidth />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Cancel
            </Button>
            <FormattedMessage id="userProfile.deleteAccount" defaultMessage="Delete Account" description="Click here to terminate your account">
                {(text) => (
                    <Button onClick={closeAccount} color="default" disabled={confirmation !== "DELETE"}>
                        {text}
                    </Button>
                )}
            </FormattedMessage>
            
        </DialogActions>
    </Dialog>
))

export default SettingsHOC(Settings);