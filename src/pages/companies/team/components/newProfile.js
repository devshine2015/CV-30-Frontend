import React from 'react';
import { TextField, IconButton, Icon } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import uuid from 'uuidv4';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { handleShallowUser, setFeedbackMessage, queryTeam } from '../../../../store/queries';

const NewProfileHOC = compose(
    withRouter,
    withState('formData', 'setFormData', props => {
        return {
            id: uuid()
        };
    }),
    withState('isSaving', 'setIsSaving', false),
    graphql(handleShallowUser, { name: 'handleShallowUserMutation' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
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
                    refetchQueries: [{
                        query: queryTeam,
                        fetchPolicy: 'network-only',
                        name: 'queryTeam',
                        variables: {
                            language: lang,
                            id: teamId
                        }
                    }]
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
        }
    }),
    pure
)

const NewProfile = props => {
    const {
        formData: { firstName, lastName, email, position },
        handleFormChange, onClose, isSaving, saveMember
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
