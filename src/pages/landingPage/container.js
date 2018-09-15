import { compose, pure, withHandlers, lifecycle, withState } from 'recompose';
import LandingPage from './component';
import { graphql } from 'react-apollo';
import { landingPage, getCurrentUser } from '../../store/queries';
import { withRouter } from 'react-router-dom';

const LandingPageHOC = compose(
    withRouter,
    graphql(landingPage, {
        name: 'landingPageQuery',
        options: props => ({
            fetchPolicy: 'network-only',
            variables: {
                language: props.match.params.lang
            },
        }),
    }),
    graphql(getCurrentUser, { name: 'currentUserQuery' }),
    withState('editMode', 'set', false),
    lifecycle({
        // componentDidUpdate(prevProps, prevState, snapshot) {
        //     const {currentUserQuery: { auth }, isEditAllowed, editMode, updateIsEditAllowed, updateEditMode, userWantsEditSwitch, set } = this.props;
        //     const { currentUser } = auth || {};
        //     const newIsEditAllowed = currentUser && currentUser.god ? true : false;

        //     // isEditAllowed is the master flag
        //     if (newIsEditAllowed !== isEditAllowed) {
        //         set(state => ({ ...state, userWantsEditSwitch: newIsEditAllowed }));
                
        //         // Mandatory modeEdit change in this case
        //         const newEditMode = newIsEditAllowed ? true : false;
        //         if (newEditMode !== editMode) {
        //             set(state => ({ ...state, editMode: newEditMode }));
        //         }
        //     } else if (userWantsEditSwitch) {
        //         // User read/edit toggle
        //         set(state => ({ ...state, userWantsEditSwitch: false }));
        //         if (newIsEditAllowed) {
        //             set(state => ({ ...state, editMode: !editMode }));
        //         }
        //     }
        // },
    }),
    withHandlers({
        switchEditMode: ({ editMode, set }) => () => {
            set(!editMode);
        }
    }),
    pure
);

export default LandingPageHOC(LandingPage);