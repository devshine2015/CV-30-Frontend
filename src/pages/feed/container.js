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
    withState('formData', 'setFormData', {
        id: uuid()
    }),
    withState('isArticle', 'updateIsArticle', false),
    withState('mediaUploadAnchor', 'setMediaUploadAnchor', null),
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
        addPost: ({ handleArticle, match, formData, setPopupOpen, setFeedbackMessage, setFormData }) => async () => {
            const article = {
                id: uuid(),
                isPost: true,
                title: 'Post',
                images: formData.images,
                videos: formData.videos,
                description: formData.postBody
            };

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
                setFormData({ id: uuid() });
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
        openMediaUpload: ({ setMediaUploadAnchor }) => target => setMediaUploadAnchor(target),
        closeMediaUpload: ({ setMediaUploadAnchor, setFormData }) => (data) => {
            let { imgParams, video } = data;

            if (imgParams)
                setFormData(state => ({ ...state, 'images': [imgParams] }));
            if (video)
                setFormData(state => ({ ...state, 'videos': [video] }));

            setMediaUploadAnchor(null);
        },
    }),
    pure
);

export default NewsFeedHOC(NewsFeed);