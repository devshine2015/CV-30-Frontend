import Article from './component';
import { compose, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { getArticle, getCurrentUser, getEditMode } from '../../../store/queries';

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
    graphql(getEditMode, { name: 'getEditMode' }),
    pure
);

export default ArticleHOC(Article);