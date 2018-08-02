import NewsFeed from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import uuid from 'uuidv4';

import { currentProfileQuery, getNewsFeedArticles, handleArticle, setFeedbackMessage } from '../../store/queries';

const NewsFeedHOC = compose(
    withRouter,
    graphql(currentProfileQuery, {
        name: 'currentUser',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang,
                id: null
            }
        }),
    }),
    graphql(getNewsFeedArticles, {
        name: 'newsFeedArticlesQuery',
        options: (props) => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            }
        }),
    }),
    graphql(handleArticle, { name: 'handleArticle' }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', {}),
    withState('isArticle', 'updateIsArticle', false),
    withHandlers({
        handleFormChange: props => event => {
            const target = event.currentTarget;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            if (!name) {
                throw Error('Field must have a name attribute!');
            }
            props.setFormData(state => ({ ...state, [name]: value }));
        },
        switchIsArticle: ({ isArticle, updateIsArticle }) => () => {
            updateIsArticle(!isArticle);
        },
        addPost: ({ handleArticle, match, formData, setPopupOpen, setFeedbackMessage }) => async () => {
            const article = {
                id: uuid(),
                isPost: true,
                title: 'Post',
                images: formData.images,
                description: formData.postBody
            };

            if (formData.videoURL) {
                article.videos = [
                    {
                        id: uuid(),
                        title: formData.videoURL,
                        sourceType: 'article',
                        path: formData.videoURL
                    }
                ];
            }

            try {
                await handleArticle({
                    variables: {
                        article,
                        language: match.params.lang
                    },
                    refetchQueries: [{
                        query: getNewsFeedArticles,
                        fetchPolicy: 'network-only',
                        name: 'newsFeedArticlesQuery',
                        variables: {
                            language: match.params.lang
                        }
                    }]
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
            }
            catch (err) {
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
                console.log(err);
            }
        },
    }),
    pure
);

export default NewsFeedHOC(NewsFeed);