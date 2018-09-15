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
    withState('state', 'setState', () => ({
        formData: {
            id: uuid()
        },
        isSaving: false,
        imageUploadOpen: false
    })),
    withHandlers({
        handleFormChange: ({ state, setState }) => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            setState({
                ...state,
                formData: {
                    ...state.formData,
                    [name]: value
                }
            });
        },
        saveMember: ({ handleShallowUserMutation, setFeedbackMessage, state, setState, match: { params: { lang, teamId } }, onClose }) => async () => {
            try {
                setState({ ...state, isSaving: true });
                await handleShallowUserMutation({
                    variables: {
                        shallowUser: state.formData,
                        options: {
                            shallowUserId: state.formData.id,
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
                setState({ ...state, isSaving: false });
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
        handleSuccess: ({ state, setState }) => async ({ path, filename }) =>
            setState({ ...state, formData: { ...state.formData, avatarPath: path ? path : `/${profilesFolder}/${state.formData.id}/${filename}` }}),
        removeImage: ({ state, setState }) => () => setState({ ...state, formData: { ...state.formData, avatarPath: null }})
    }),
    pure
)

const NewProfile = props => {
    const {
        state: { isSaving, imageUploadOpen, formData: { id, firstName, lastName, email, position, description, avatarPath } },
        handleFormChange, onClose, saveMember,
        openImageUpload, closeImageUpload, handleError, handleSuccess, removeImage
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
                        <img src={`${s3BucketURL}${avatarPath}`} className='previewImg' alt='' />
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
