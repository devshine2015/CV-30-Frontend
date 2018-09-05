import React, { Component } from 'react';
import { Chip, TextField } from '@material-ui/core';

class TagsInput extends Component {
    state = {
        newTag: ''
    }

    handleChange = (e) => {
        this.setState({ newTag: e.target.value })
    }

    handleKeyDown = (e) => {
        if ((e.keyCode === 13 || e.keyCode === 9 || e.keyCode === 188) && e.target.value !== '') {
            e.preventDefault();

            const newTag = this.state.newTag.trim()

            if (this.props.value.indexOf(newTag) === -1) {
                this.setState({ newTag: '' })
                this.props.onChange([...this.props.value, newTag]);
            }
        }

        if (e.keyCode === 8 && this.props.value.length && !e.target.value.length) {
            this.setState({ newTag: '' });
            this.props.onChange(this.props.value.slice(0, this.props.value.length - 1));
        }
    }

    handleRemoveTag = (e) => {
        const tag = e.target.parentNode.textContent.trim();
        this.setState({ newTag: '' })
        this.props.onChange(this.props.value.filter(item => item !== tag));
    }

    render() {
        return (
            <TextField
                id="newSkill"
                label={this.props.label}
                placeholder={this.props.placeholder}
                value={this.state.newTag}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                className={this.props.className || 'textField'}
                fullWidth
                FormHelperTextProps={{
                    classes: { root: 'inputHelperText' }
                }}
                InputProps={{
                    startAdornment: this.props.value.map(item => (
                        <Chip
                            key={item}
                            label={item}
                            onDelete={this.handleRemoveTag}
                            className='chip'
                            clickable={false}
                        />
                    )),
                    classes: {
                        root: 'inputRoot',
                        input: 'tagInput',
                        underline: 'textFieldUnderline'
                    }
                }}
                InputLabelProps={{
                    className: 'textFieldLabel'
                }}
                helperText={`Hit 'Enter, Tab or ',' to add new ${this.props.helpTagName}`}
            />
        )
    }
}

export default TagsInput;