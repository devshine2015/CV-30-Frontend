import React from 'react';
import { Button, Menu, MenuItem, TextField, Icon, IconButton } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';

import fields from '../../../../constants/contact';
import { setContact, currentProfileQuery } from '../../../../store/queries';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const EditContactDetailsHOC = compose(
    withRouter,
    graphql(setContact, { name: 'setContact' }),
    withState('formData', 'setFormData', ({ contact }) => {
        if (!contact) {
            return {};
        } else {
            let formData = {};
            Object.keys(contact).map(key => {
                const result = fields.find(field => field.id === key);
                if (result && contact[key] && contact[key] !== '') {
                    formData[key] = contact[key];
                }
                return null;
            });
            return formData;
        }

    }),
    withState('anchorEl', 'setAnchorEl', null),
    withHandlers({
        handleClick: ({ setAnchorEl }) => event => {
            setAnchorEl(event.currentTarget);
        },

        handleClose: ({ setAnchorEl }) => () => {
            setAnchorEl(null);
        },
        addField: ({ setAnchorEl, formData, setFormData }) => (fieldId) => {
            let contact = Object.assign({}, formData);
            if (!contact[fieldId]) {
                contact[fieldId] = '';
                setFormData(contact);
            }
            setAnchorEl(null);
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
        removeTextField: ({ formData, setFormData }) => async (key) => {
            let contact = Object.assign({}, formData);
            await delete contact[key];
            setFormData(contact);
        },
        updateContact: ({ setContact, formData, match }) => async () => {
            try {
                await setContact({
                    variables: {
                        contact: formData
                    },
                    refetchQueries: [{
                        query: currentProfileQuery,
                        fetchPolicy: 'network-only',
                        name: 'currentUser',
                        variables: {
                            language: 'en',
                            id: match.params.profileId
                        }
                    }]
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }),
    pure
);

const EditContactDetails = ({ anchorEl, handleClick, handleClose, addField, handleFormChange, formData, removeTextField, open, updateContact }) => {
    return (
        <div className={open ? 'editContactDetails open' : 'editContactDetails'}>
            <p className='message'>
                Add section
            </p>
            <div>
                <Button className='addContactFieldBtn'
                    aria-owns={anchorEl ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    Select field
                </Button>
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