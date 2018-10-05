import React from 'react';
import { Popover, TextField } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'

import { handleArticleTags, setFeedbackMessage } from '../../../store/queries';

const AddTagHOC = compose(
    withRouter,
    graphql(handleArticleTags, { name: 'handleArticleTags' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('newTag', 'setNewTag', ''),
    withHandlers({
        updateNewTag: ({ setNewTag }) => text => setNewTag(text),
        handleKeyPress: ({ handleArticleTags, articleId, tags, newTag, setNewTag, match: { params: { lang: language } }, setFeedbackMessage, closeTagEditor, refetch }) => async event => {
            if (event.key !== 'Enter')
                return;

            event.preventDefault();
            let currentTags = tags.map(tag => tag.title);
            try {
                await handleArticleTags({
                    variables: {
                        language,
                        details: {
                            titles: [...currentTags, newTag],
                            articleId
                        }
                    }
                });
                await refetch();
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                setNewTag('');
                closeTagEditor();
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
)

const AddTag = props => {
    const { tagAnchor, closeTagEditor, updateNewTag, newTag, handleKeyPress } = props;
    return (
        <Popover
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={Boolean(tagAnchor)}
            anchorEl={tagAnchor}
            onClose={closeTagEditor}
            classes={{
                paper: 'addTagsPaper'
            }}
        >
            <div className='addTag'>
                <p className='title'>Apreciate your own way</p>
                <FormattedMessage id="feed.addNewTag" defaultMessage="Add Tag" description="Add Tag">
                    {(text) => (
                        <TextField
                            name="newTag"
                            label={text.split("\n")[0]}
                            placeholder={text.split("\n")[1]}
                            className='textField'
                            onChange={event => updateNewTag(event.target.value)}
                            onKeyPress={event => handleKeyPress(event)}
                            value={newTag || ''}
                            fullWidth
                            InputProps={{
                                classes: {
                                    input: 'textFieldInput',
                                    underline: 'textFieldUnderline'
                                },
                            }}
                            InputLabelProps={{
                                className: 'textFieldLabel'
                            }}
                        />
                    )}
                </FormattedMessage>
                <FormattedMessage id="feed.helperText" defaultMessage="Search for a tag or create your own to share what did you found the most interesting about this post." description="Helper Text">
                    {(text) => (<small className='helperText'>{text}</small>)}
                </FormattedMessage>
                
            </div>
        </Popover>
    );
};

export default AddTagHOC(AddTag);