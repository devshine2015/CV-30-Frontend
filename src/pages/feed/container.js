import NewsFeed from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { currentProfileQuery, getNewsFeedArticles } from '../../store/queries';

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
        }
    }),
    pure
);

export default NewsFeedHOC(NewsFeed);