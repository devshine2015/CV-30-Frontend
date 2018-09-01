import React from 'react';
import { TextField, IconButton, Icon, Button } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import uuid from 'uuidv4';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { handleShallowUser, setFeedbackMessage } from '../../../../store/queries';
import { teamRefetch } from '../../../../store/refetch';
import { profilesFolder, s3BucketURL } from '../../../../constants/s3';
import ImageUploader from '../../../../components/imageUploader';

const NewProfileHOC = compose(
    withRouter,
    graphql(handleShallowUser, { name: 'handleShallowUserMutation' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', () => {
        return {
            id: uuid()
        };
    }),
    withState('isSaving', 'setIsSaving', false),
    withState('imageUploadOpen', 'setImageUploadOpen', false),
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
        saveMember: ({ handleShallowUserMutation, setFeedbackMessage, formData, match: { params: { lang, teamId } }, setIsSaving, onClose }) => async () => {
            try {
                setIsSaving(true);

                await handleShallowUserMutation({
                    variables: {
                        shallowUser: formData,
                        options: {
                            shallowUserId: formData.id,
                            teamId: teamId,
                            isMember: true
                        }
                    },
                    refetchQueries: [
                        teamRefetch(teamId, lang)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                setIsSaving(false);
                onClose();
            }
            catch (err) {
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        openImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(true),
        closeImageUpload: ({ setImageUploadOpen }) => () => setImageUploadOpen(false),
        handleError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        handleSuccess: ({ setFormData, formData: { id } }) => async ({ path, filename }) =>
            setFormData(state => ({ ...state, 'avatarPath': path ? path : `/${profilesFolder}/${id}/${filename}` })),
        removeImage: ({ setFormData }) => () => setFormData(state => ({ ...state, 'avatarPath': null })),

    }),
    pure
)

const NewProfile = props => {
    const {
        formData: { id, firstName, lastName, email, position, description, avatarPath },
        handleFormChange, onClose, isSaving, saveMember,
        openImageUpload, closeImageUpload, imageUploadOpen, handleError, handleSuccess, removeImage
    } = props;

    return (
        <div className='newMemberForm'>
            <h4>Add member</h4>
            <section className='infoFields'>
                <TextField
                    name="firstName"
                    label="First name"
                    placeholder="Member's first name..."
                    className='textField'
                    onChange={handleFormChange}
                    value={firstName || ''}
                    fullWidth
                />
                <TextField
                    name="lastName"
                    label="Last name"
                    placeholder="Member's last name..."
                    className='textField'
                    onChange={handleFormChange}
                    value={lastName || ''}
                    fullWidth
                />
                <TextField
                    name="email"
                    label="Email"
                    placeholder="Member's email address..."
                    className='textField'
                    onChange={handleFormChange}
                    value={email || ''}
                    fullWidth
                />
                <TextField
                    name="position"
                    label="Position"
                    placeholder="Member's position..."
                    className='textField'
                    onChange={handleFormChange}
                    value={position || ''}
                    fullWidth
                />
                <TextField
                    name="description"
                    label="Description"
                    placeholder="Short description..."
                    className='textField'
                    onChange={handleFormChange}
                    value={description || ''}
                    fullWidth
                />
                {avatarPath ?
                    <div className="imagePreview">
                        <img src={`${s3BucketURL}${avatarPath}`} className='previewImg' />
                        <IconButton className='removeBtn' onClick={removeImage}>
                            <Icon>cancel</Icon>
                        </IconButton>
                    </div> :
                    <React.Fragment>
                        <Button className='uploadBtn' onClick={openImageUpload}>
                            Upload picture
                    </Button>
                        <ImageUploader
                            type='profile_avatar'
                            open={imageUploadOpen}
                            onClose={closeImageUpload}
                            onError={handleError}
                            onSuccess={handleSuccess}
                            id={id}
                        />
                    </React.Fragment>
                }
            </section>
            <section className='editControls'>
                <IconButton className='cancelBtn' onClick={onClose} disabled={isSaving}>
                    <Icon>close</Icon>
                </IconButton>
                <IconButton className='submitBtn' onClick={saveMember} disabled={isSaving}>
                    <Icon>done</Icon>
                </IconButton>
            </section>
        </div>
    )
};

export default NewProfileHOC(NewProfile);
