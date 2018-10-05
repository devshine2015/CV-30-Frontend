import React from 'react';
import { Popover, IconButton, Icon } from '@material-ui/core';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'
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
                <FormattedMessage id="articles.view.appreciate" defaultMessage="Appreciate your own way" description="Appreciate your own way">
                    {(text) => (
                        <p className='title'>{text}</p>
                    )}
                </FormattedMessage>
                
                <TagsInput value={newTags} onChange={setTags} helpTagName='tag' />
                <FormattedMessage id="articles.view.searchTag" defaultMessage="Search for a tag or create your own to share what did you found the most interesting about this post." description="Search  Tag">
                    {(text) => (
                        <small className='helperText'>{text}</small>
                    )}
                </FormattedMessage>
                
                <IconButton onClick={updateTags} className='submitBtn'>
                    <Icon>done</Icon>
                </IconButton>
            </div>
        </Popover>
    );
};

export default AddTagHOC(AddTag);