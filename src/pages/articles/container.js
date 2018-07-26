import Article from './component';
import { compose, withState, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getArticle, getCurrentUser } from '../../store/queries';

const ArticleHOC = compose(
    withRouter,
    graphql(getArticle, {
        name: 'getArticle',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                id: props.match.params.articleId,
                language: props.match.params.lang
            },
        }),
    }),
    graphql(getCurrentUser, {
        name: 'currentUser'
    }),
    withState('editMode', 'updateEditMode', false),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);

export default ArticleHOC(Article);