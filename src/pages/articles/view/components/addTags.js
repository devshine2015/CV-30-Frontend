import React from 'react';
import { Popover, IconButton, Icon } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { handleArticleTags, setFeedbackMessage } from '../../../../store/queries';
import { articleRefetch } from '../../../../store/refetch';
import TagsInput from '../../../../components/TagsInput';

const AddTagHOC = compose(
    withRouter,
    graphql(handleArticleTags, { name: 'handleArticleTags' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('newTags', 'setNewTags', ({ tags }) => tags.map(tag => tag.title)),
    withHandlers({
        updateTags: ({ handleArticleTags, articleId, newTags, match: { params: { lang: language } }, setFeedbackMessage, closeTagEditor }) => async () => {
            try {
                await handleArticleTags({
                    variables: {
                        language,
                        details: {
                            titles: newTags,
                            articleId
                        }
                    },
                    refetchQueries: [
                        articleRefetch(articleId, language)
                    ]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                // setNewTag('');
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
        },
        setTags: ({ setNewTags }) => tags => setNewTags(tags)
    }),
    pure
)

const AddTag = props => {
    const { tagAnchor, closeTagEditor, setTags, newTags, updateTags } = props;
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
                <TagsInput value={newTags} onChange={setTags} helpTagName='tag' />
                <small className='helperText'>Search for a tag or create your own to share what did you found the most interesting about this post.</small>
                <IconButton onClick={updateTags} className='submitBtn'>
                    <Icon>done</Icon>
                </IconButton>
            </div>
        </Popover>
    );
};

export default AddTagHOC(AddTag);