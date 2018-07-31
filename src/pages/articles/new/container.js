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
            const { handleArticle, formData: { id, title, description }, setIsSaving, match, setFeedbackMessage, history } = props;

            const article = {
                id,
                title,
                description
            };

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
        }
    }),
    pure
);

export default NewArticleHOC(NewArticle);