import React from 'react';
import { Popover, TextField } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { handleArticleTag, setFeedbackMessage, getNewsFeedArticles } from '../../../store/queries';

const AddTagHOC = compose(
    withRouter,
    graphql(handleArticleTag, { name: 'handleArticleTag' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('newTag', 'setNewTag', ''),
    withHandlers({
        updateNewTag: ({ setNewTag }) => text => setNewTag(text),
        handleKeyPress: ({ handleArticleTag, articleId, newTag, match: { params: { lang: language } }, setFeedbackMessage, closeTagEditor }) => async event => {
            if (event.key !== 'Enter')
                return;

            event.preventDefault();
            try {
                await handleArticleTag({
                    variables: {
                        language,
                        details: {
                            title: newTag,
                            articleId,
                            isSet: true
                        }
                    },
                    refetchQueries: [{
                        query: getNewsFeedArticles,
                        fetchPolicy: 'network-only',
                        name: 'newsFeedArticlesQuery',
                        variables: {
                            language
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
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
                <TextField
                    name="newTag"
                    label="Tag"
                    placeholder="Add tag..."
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
                <small className='helperText'>Search for a tag or create your own to share what did you found the most interesting about this post.</small>
            </div>
        </Popover>
    );
};

export default AddTagHOC(AddTag);