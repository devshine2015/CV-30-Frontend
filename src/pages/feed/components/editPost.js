import React from 'react';
import { TextField, IconButton, Icon } from '@material-ui/core';
import { compose, withState, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { handleArticle, setFeedbackMessage, getNewsFeedArticles } from '../../../store/queries';
import { withRouter } from 'react-router-dom';

const EditPostHOC = compose(
    withRouter,
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('post', 'setPost', ({ article: { i18n } }) => i18n && i18n[0] && i18n[0].description ? i18n[0].description : ''),
    withHandlers({
        handleFormChange: ({ setPost }) => ev => setPost(ev.target.value),
        updatePost: ({ handleArticle, post, setFeedbackMessage, match: { params: { lang: language } }, article: { id }, closeEditor }) => async () => {
            try {
                await handleArticle({
                    variables: {
                        language,
                        article: {
                            id,
                            title: 'Post',
                            description: post
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
                closeEditor();
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
    })
)

const EditPost = ({ post, handleFormChange, updatePost }) => (
    <div className='editPost'>
        <TextField
            name="post"
            placeholder="Say something..."
            className='textField'
            onChange={handleFormChange}
            value={post}
            type='text'
            multiline
            rows={1}
            rowsMax={10}
        />
        <IconButton onClick={updatePost} className='updatePostBtn'>
            <Icon>done</Icon>
        </IconButton>
    </div>
);

export default EditPostHOC(EditPost);