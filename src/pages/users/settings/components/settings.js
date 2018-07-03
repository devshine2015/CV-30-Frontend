import React from 'react';
import { Grid, Avatar, Button, TextField } from '@material-ui/core';
import S3Uploader from 'react-s3-uploader';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { s3BucketURL, profilesFolder } from '../../../../constants/s3';
import { currentUserQuery, updateAvatar, localUserQuery, updateAvatarTimestampMutation } from '../../../../store/queries';

const SettingsHOC = compose(
    graphql(updateAvatar, { name: 'updateAvatar' }),
    graphql(updateAvatarTimestampMutation, { name: 'updateAvatarTimestamp' }),
    graphql(localUserQuery, { name: 'localUserData' }),
    withState('isUploading', 'setIsUploading', false),
    withState('uploadProgress', 'setUploadProgress', 0),
    withState('uploadError', 'setUploadError', null),
    withState('formData', 'setFormData', ({ currentUser }) => {
        if (!currentUser || !currentUser.profile)
            return {};
        let { firstName, lastName, email } = currentUser.profile;
        return { firstName, lastName, email };

    }),
    withHandlers({
        getSignedUrl: () => async (file, callback) => {
            let getExtension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
            let fName = ['avatar', getExtension].join('.');

            const params = {
                fileName: fName,
                contentType: file.type
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
    }),
    pure
)
const Settings = props => {
    const { getSignedUrl, onUploadStart, onProgress, onError, onFinishUpload, isUploading, localUserData, currentUser, handleFormChange, formData } = props;
    const { firstName } = formData;

    let avatar =
        (!localUserData.loading && currentUser.profile.hasAvatar) ? `${s3BucketURL}/${profilesFolder}/avatar.jpg?${localUserData.localUser.timestamp}` : null

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
                />
            </div>
        </div>
    );
}

export default SettingsHOC(Settings);