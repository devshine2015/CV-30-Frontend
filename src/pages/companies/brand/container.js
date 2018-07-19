import Brand from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import { companyQuery, getCurrentUser } from '../../../store/queries';

const BrandHOC = compose(
    withRouter,
    graphql(companyQuery, {
        name: "companyQuery",
        options: props => ({
            variables: {
                id: props.match.params.companyId,
                language: props.match.params.lang
            },
            fetchPolicy: 'network-only'
        })
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
export default BrandHOC(Brand);
