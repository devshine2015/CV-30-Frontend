import React from 'react';
import { Button, Menu, MenuItem, TextField, Icon, IconButton, InputAdornment } from '@material-ui/core';
import { compose, pure, withState, withHandlers } from 'recompose';

const fields = [
    {
        id: 'phoneNo',
        text: 'Phone number'
    },
    {
        id: 'address',
        text: 'Address'
    },
    {
        id: 'fb',
        text: 'Facebook'
    },
    {
        id: 'linkedIn',
        text: 'LinkedIn'
    }
];
const EditContactDetails = ({ anchorEl, handleClick, handleClose, addField, handleFormChange, formData, removeTextField }) => {
    // debugger;
    return (
        <div className='editContactDetails'>
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
                        let text = result.text || '';
                        return (
                            <TextField
                                key={key}
                                name={key}
                                label={text}
                                placeholder={text}
                                fullWidth
                                className='textField'
                                onChange={handleFormChange}
                                value={formData[key] || ''}
                                InputProps={{
                                    classes: {
                                        root: 'contactTextInputRoot',
                                        input: 'contactTextInput',
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <IconButton className='removeBtn'
                                                onClick={() => removeTextField(key)}
                                            >
                                                <Icon>
                                                    close
                                                </Icon>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                InputLabelProps={{
                                    className: 'contactFormLabel'
                                }}

                            />)
                    })}
            </form>
        </div>
    );
};

const EditContactDetailsHOC = compose(
    withState('formData', 'setFormData', ({ contact }) => (contact || {})),
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
        }
    }),
    pure
);

export default EditContactDetailsHOC(EditContactDetails);