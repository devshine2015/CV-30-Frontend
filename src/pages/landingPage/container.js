import { compose, pure, withHandlers, lifecycle } from 'recompose';
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
    // withState('state', 'setState', {
    //     isEditAllowed: false,
    //     editMode: false,
    //     userWantsEditSwitch: false
    // }),
    lifecycle({
        // componentDidUpdate(prevProps, prevState, snapshot) {
        //     const {currentUserQuery: { auth }, isEditAllowed, editMode, updateIsEditAllowed, updateEditMode, userWantsEditSwitch, updateUserWantsEditSwitch } = props;
        //     const { currentUser } = auth || {};
        //     const newIsEditAllowed = currentUser && currentUser.god ? true : false;

        //     // isEditAllowed is the master flag
        //     if (newIsEditAllowed !== isEditAllowed) {
        //         updateIsEditAllowed(newIsEditAllowed);
                
        //         // Mandatory modeEdit change in this case
        //         const newEditMode = newIsEditAllowed ? true : false;
        //         if (newEditMode !== editMode) {
        //             updateEditMode(newEditMode);
        //         }
        //     } else if (userWantsEditSwitch) {
        //         // User read/edit toggle
        //         updateUserWantsEditSwitch(false);
        //         if (newIsEditAllowed) {
        //             updateEditMode(!editMode);
        //         }
        //     }
        // },
    }),
    withHandlers({
        // switchEditMode: ({ updateUserWantsEditSwitch }) => () => {
        //     updateUserWantsEditSwitch(true);
        // }
    }),
    pure
);

export default LandingPageHOC(LandingPage);