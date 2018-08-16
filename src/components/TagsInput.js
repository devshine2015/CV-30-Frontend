import React, { Component } from 'react';
import { Input } from '@material-ui/core';

const Tag = props => <span className="tag" {...props} />
const Delete = props => <button className="delete" {...props} />
const Help = props => <span className="help" {...props} />

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
            //e.target.value = ''
        }

        if (e.keyCode === 8 && this.props.value.length && !e.target.value.length ) {
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
            <div>
                <div className="tags-input">
                    {this.props.value.map((tag) => (
                        <Tag key={tag}>
                            {tag}
                            <Delete onClick={this.handleRemoveTag} />
                        </Tag>
                    ))}
                    <Input
                        id="tagsInput"
                        value={this.state.newTag}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown} />
                </div>
                <Help>hit 'Enter, Tab or ,' to add new {this.props.helpTagName}</Help>
            </div>
        )
    }
}

export default TagsInput;