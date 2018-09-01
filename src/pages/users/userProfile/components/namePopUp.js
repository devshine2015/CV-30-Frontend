import React from 'react';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { Popover, IconButton, Icon, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import { updateUserSettingsMutation, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';

const NamePopUpHOC = compose(
    withRouter,
    graphql(updateUserSettingsMutation, { name: 'updateUserSettings' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', ({ profile }) => {
        if (!profile)
            return {};
        const { firstName, lastName, position } = profile;
        return { firstName, lastName, position };
    }),
    withHandlers({
        handleFormChange: props => event => {
            if (typeof event.name !== undefined && event.name === 'video') {
                props.setFormData(state => ({ ...state, video: event }));
                return;
            }

            const target = event.currentTarget;
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        saveData: ({ formData: { firstName, lastName, position }, updateUserSettings, match: { params: { lang: language } }, setFeedbackMessage, onClose }) => async () => {
            try {
                const { data: { updateUserSettings: { status } } } = await updateUserSettings({
                    variables: {
                        userSettings: {
                            firstName,
                            lastName
                        },
                        position
                    },
                    refetchQueries: [
                        currentProfileRefetch(language)
                    ]
                });
                if (status) {
                    await setFeedbackMessage({
                        variables: {
                            status: 'success',
                            message: 'Changes saved successfully.'
                        }
                    });
                    onClose();
                }
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
        }
    }),
    pure
);

const NamePopUp = ({ anchor, onClose, handleFormChange, formData: { firstName, lastName, position }, saveData }) => {
    return (
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onClose}
            classes={{
                paper: 'nameEditPaper'
            }}
        >
            <div className='popupBody'>
                <TextField
                    name="firstName"
                    label="First name"
                    placeholder="Enter your first name..."
                    className='textField'
                    onChange={handleFormChange}
                    value={firstName || ''}
                />
                <TextField
                    name="lastName"
                    label="Last name"
                    placeholder="Enter your last name..."
                    className='textField'
                    onChange={handleFormChange}
                    value={lastName || ''}
                />
                <TextField
                    name="position"
                    label="Current position"
                    placeholder="Position..."
                    className='textField'
                    fullWidth
                    onChange={handleFormChange}
                    value={position || ''}
                />
            </div>
            <div className='popupFooter'>
                <IconButton className='footerCheck' onClick={saveData}>
                    <Icon>done</Icon>
                </IconButton>
            </div>
        </Popover>
    );
};

export default NamePopUpHOC(NamePopUp);