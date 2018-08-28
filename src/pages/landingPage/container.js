import { compose, pure, withState, withHandlers } from 'recompose';
import LandingPage from './component';
import { graphql } from 'react-apollo';
import { landingPage } from '../../store/queries';
import { withRouter } from 'react-router-dom';

const LandingPageHOC = compose(
    withRouter,
    graphql(landingPage, {
        name: 'landingPage',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    withState('editMode', 'updateEditMode', true),
    withHandlers({
        switchEditMode: ({ editMode, updateEditMode }) => () => {
            updateEditMode(!editMode);
        }
    }),
    pure
);

export default LandingPageHOC(LandingPage);