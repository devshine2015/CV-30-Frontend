import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { getCurrentUser, localUserQuery } from '../../store/queries';
import Navigation from './component';
import Logout from '../../hocs/logout';

/*const notifications = [
    {
        avatar: 'http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg',
        message: 'message',
        timeElapsed: '1h'
    },
    {
        avatar: 'http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg',
        message: 'message',
        timeElapsed: '1h'
    },
    {
        avatar: 'http://digitalspyuk.cdnds.net/17/25/980x490/landscape-1498216547-avatar-neytiri.jpg',
        message: 'message',
        timeElapsed: '1h'
    }
];*/

const NavigationHOC = compose(
    withRouter,
    graphql(getCurrentUser, {
        name: 'currentUser'
    }),
    graphql(localUserQuery, { name: 'localUserData' }),
    withState('state', 'setState', {
        profileMenuOpen: false,
        notificationsMenuOpen: false,
        mobileNavOpen: false,
        mobileNotificationIsOpen: false,
        mobileProfileIsOpen: false,
        notifications: []
    }),
    Logout,
    withHandlers({
        //desktop profile menu functions
        toggleProfileMenu: ({ state, setState }) => () => setState({
            ...state,
            profileMenuOpen: !state.profileMenuOpen
        }),
        closeProfileMenu: ({ state, setState }) => () => setState({
            ...state,
            profileMenuOpen: false
        }),
        //desktop notifications menu functions
        toggleNotificationsMenu: ({ state, setState }) => () => setState({
            ...state,
            notificationsMenuOpen: !state.notificationsMenuOpen
        }),
        closeNotificationsMenu: ({ state, setState }) => () => setState({
            ...state,
            notificationsMenuOpen: false
        }),
        //mobile nav
        toggleMobileNav: ({ state, setState }) => () => setState({
            ...state,
            mobileNavOpen: !state.mobileNavOpen,
            notificationsMenuOpen: false,
            profileMenuOpen: false
        }),
        closeMobileNav: ({ state, setState }) => () => setState({
            ...state,
            mobileNavOpen: false
        }),
        //mobile notifications
        toggleMobileNotifications: ({ state, setState }) => () => setState({
            ...state,
            mobileNotificationIsOpen: state.mobileNotificationIsOpen,
            mobileNavOpen: false,
            mobileProfileIsOpen: false
        }),
        closeMobileNotifications: ({ state, setState }) => () => setState({
            ...state,
            mobileNotificationIsOpen: false
        }),
        //mobile profile
        toggleMobileProfile: ({ state, setState }) => () => setState({
            ...state,
            mobileProfileIsOpen: state.mobileProfileIsOpen,
            mobileNavOpen: false,
            mobileNotificationIsOpen: false
        }),
        closeMobileProfile: ({ state, setState }) => () => setState({
            ...state,
            mobileProfileIsOpen: false
        })
    }),
    pure
);

export default NavigationHOC(Navigation);