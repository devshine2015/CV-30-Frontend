import NewArticle from './component';
import { compose, withState, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import uuid from 'uuidv4';

import { handleArticle, setFeedbackMessage } from '../../../store/queries';

const NewArticleHOC = compose(
    withRouter,
    graphql(handleArticle, {
        name: 'handleArticle'
    }),
    graphql(setFeedbackMessage, { name: 'setFeedbackMessage' }),
    withState('formData', 'setFormData', props => {
        return {
            id: uuid()
        };
    }),
    withState('isVideoUrl', 'changeMediaType', true),
    withState('isSaving', 'setIsSaving', false),
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
        updateDescription: props => text => {
            props.setFormData(state => ({ ...state, 'description': text }));
        },
        switchMediaType: ({ isVideoUrl, changeMediaType }) => () => {
            changeMediaType(!isVideoUrl);
        },
        saveArticle: props => async () => {
            const { handleArticle, formData: { id, title, description, videoURL, images }, setIsSaving, match, setFeedbackMessage, history } = props;

            const article = {
                id,
                title,
                description,
                images
            };

            if (videoURL) {
                article.videos = [
                    {
                        id: uuid(),
                        title: videoURL,
                        sourceType: 'article',
                        path: videoURL

                    }
                ];
            }

            try {
                await handleArticle({
                    variables: {
                        language: match.params.lang,
                        article
                    }
                });
                await setFeedbackMessage({
                    variables: {
                        status: 'success',
                        message: 'Changes saved successfully.'
                    }
                });
                history.push(`/${match.params.lang}/article/${id}`);
            }
            catch (err) {
                console.log(err);
                setIsSaving(true);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: err.message
                    }
                });
            }
        },
        getSignedUrl: ({ formData, setFeedbackMessage }) => async (file, callback) => {
            const params = {
                fileName: file.name,
                contentType: file.type,
                id: formData.id,
                type: 'article'
            };

            try {
                let response = await fetch('https://k73nyttsel.execute-api.eu-west-1.amazonaws.com/production/getSignedURL', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                });
                let responseJson = await response.json();
                callback(responseJson);
            } catch (error) {
                console.error(error);
                callback(error);
                await setFeedbackMessage({
                    variables: {
                        status: 'error',
                        message: error || error.message
                    }
                });
            }
        },
        onUploadStart: ({ setIsSaving, formData, setFormData, match }) => (file, next) => {
            let size = file.size;
            if (size > 1024 * 1024) {
                alert('File is too big!');
            } else {
                let newFormData = Object.assign({}, formData);

                newFormData.images = [{
                    id: uuid(),
                    title: file.name,
                    sourceType: 'article',
                    source: formData.id,
                    path: `/articles/${formData.id}/${file.name}`
                }];
                setFormData(newFormData);
                setIsSaving(true);
                next(file);
            }
        },
        onError: ({ setFeedbackMessage }) => async error => {
            console.log(error);
            await setFeedbackMessage({
                variables: {
                    status: 'error',
                    message: error || error.message
                }
            });
        },
        onFinishUpload: ({ setIsSaving, setFeedbackMessage }) => async data => {
            setIsSaving(false);
            await setFeedbackMessage({
                variables: {
                    status: 'success',
                    message: 'File uploaded successfully.'
                }
            });
        }
    }),
    pure
);

export default NewArticleHOC(NewArticle);