import React from 'react';
import { Button, Menu, MenuItem, TextField, Icon, IconButton } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';
import { FormattedMessage } from 'react-intl'
import fields from '../../../../constants/contact';
import { setContact, setFeedbackMessage } from '../../../../store/queries';
import { currentProfileRefetch } from '../../../../store/refetch';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const EditContactDetailsHOC = compose(
    withRouter,
    graphql(setContact, { name: 'setContact' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('state', 'setState', ({ contact }) => {
        let formData = {};
        if (contact) {
            Object.keys(contact).map(key => {
                const result = fields.find(field => field.id === key);
                if (result && contact[key] && contact[key] !== '') {
                    formData[key] = contact[key];
                }
                return null;
            });
        }
        return {
            anchorEl: null,
            formData
        };
    }),
    withHandlers({
        handleClick: ({ state, setState }) => event => setState({ ...state, anchorEl: event.currentTarget }),
        handleClose: ({ state, setState }) => () => setState({ ...state, anchorEl: null }),
        addField: ({ state, setState }) => (fieldId) => {
            let contact = Object.assign({}, state.formData);
            if (!contact[fieldId]) {
                contact[fieldId] = '';
            }
            setState({
                ...state,
                formData: contact,
                anchorEl: null
            });
        },
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
        removeTextField: ({ state, setState }) => async (key) => {
            let contact = Object.assign({}, state.formData);
            await delete contact[key];
            setState({
                ...state,
                formData: contact
            });
        },
        updateContact: ({ setContact, state: { formData }, match, setFeedbackMessage }) => async () => {
            try {
                await setContact({
                    variables: {
                        contact: formData
                    },
                    refetchQueries: [
                        currentProfileRefetch(match.params.lang)
                    ]
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
        closeFeedback: ({ setFeedbackMessage }) => () => setFeedbackMessage(null)
    }),
    pure
);

const EditContactDetails = ({
    state: { anchorEl, formData },
    handleClick, handleClose, addField, handleFormChange,
    removeTextField, open, updateContact, feedbackMessage, closeFeedback
}) => {
    return (
        <div className={open ? 'editContactDetails open' : 'editContactDetails'}>
            <FormattedMessage id="jobs.new.addSection" defaultMessage="Add section" description="Add section">
                {(text) => (
                    <p className='message'>
                        {text}
                    </p>
                )}
            </FormattedMessage>
            
            <div>
                <FormattedMessage id="jobs.new.selectField" defaultMessage="Select field" description="Select field">
                    {(text) => (
                        <Button className='addContactFieldBtn'
                            aria-owns={anchorEl ? 'simple-menu' : null}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            {text}
                        </Button>
                    )}
                </FormattedMessage>
                
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {
                        fields.map((item, index) => {
                            let key = 'addField-' + index;
                            let disabled = !!formData[item.id] || formData[item.id] === '';
                            return <MenuItem onClick={() => addField(item.id)} key={key} disabled={disabled}>{item.text}</MenuItem>
                        })
                    }
                </Menu>
            </div>
            <form className='contactDetailsEditForm' noValidate autoComplete='off'>
                {
                    Object.keys(formData).map((key) => {
                        const result = fields.find(field => field.id === key);
                        if (result) {
                            let text = result.text;
                            return (
                                <div className='formGroup' key={key}>
                                    <TextField
                                        name={key}
                                        label={text}
                                        placeholder={text}
                                        className='textField'
                                        onChange={handleFormChange}
                                        value={formData[key] || ''}
                                        InputProps={{
                                            classes: {
                                                root: 'contactTextInputRoot',
                                                input: 'contactTextInput',
                                            }
                                        }}
                                        InputLabelProps={{
                                            className: 'contactFormLabel'
                                        }}

                                    />
                                    <IconButton
                                        className='removeBtn'
                                        onClick={() => removeTextField(key)}
                                    >
                                        <Icon>
                                            close
                                    </Icon>
                                    </IconButton>
                                </div>
                            )
                        } else
                            return null;
                    })}

                <IconButton className='submitBtn' onClick={updateContact}>
                    <Icon>done</Icon>
                </IconButton>
            </form>
        </div>
    );
};

export default EditContactDetailsHOC(EditContactDetails);