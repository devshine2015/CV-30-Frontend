import Navigation from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

const notifications = [
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
];

const NavigationHOC = compose(
    withRouter,
    withState('profileMenuOpen', 'setProfileMenuStatus', false),
    withState('notificationsMenuOpen', 'setNotificationsMenuStatus', false),
    withState('mobileNavOpen', 'setMobileNavStatus', false),
    withState('mobileNotificationIsOpen', 'setMobileNotificationStatus', false),
    withState('mobileProfileIsOpen', 'setMobileProfileStatus', false),
    withState('notifications', 'setNotifications', notifications),
    withHandlers({
        //desktop profile menu functions
        toggleProfileMenu: ({ profileMenuOpen, setProfileMenuStatus }) => (event) => {
            setProfileMenuStatus(!profileMenuOpen);
        },
        closeProfileMenu: ({ setProfileMenuStatus }) => () => {
            setProfileMenuStatus(false);
        },
        //desktop notifications menu functions
        toggleNotificationsMenu: ({ notificationsMenuOpen, setNotificationsMenuStatus }) => () => {
            setNotificationsMenuStatus(!notificationsMenuOpen);
        },
        closeNotificationsMenu: ({ setNotificationsMenuStatus }) => () => {
            setNotificationsMenuStatus(false);
        },
        //mobile nav
        toggleMobileNav: ({ mobileNavOpen, setMobileNavStatus, setMobileNotificationStatus, setMobileProfileStatus }) => () => {
            setMobileNavStatus(!mobileNavOpen);
            setMobileNotificationStatus(false);
            setMobileProfileStatus(false);
        },
        closeMobileNav: ({ setMobileNavStatus }) => () => {
            setMobileNavStatus(false);
        },
        //mobile notifications
        toggleMobileNotifications: ({ mobileNotificationIsOpen, setMobileNotificationStatus, setMobileNavStatus, setMobileProfileStatus }) => () => {
            setMobileNotificationStatus(!mobileNotificationIsOpen);
            setMobileNavStatus(false);
            setMobileProfileStatus(false);
        },
        closeMobileNotifications: ({ setMobileNotificationStatus }) => () => {
            setMobileNotificationStatus(false);
        },
        //mobile profile
        toggleMobileProfile: ({ mobileProfileIsOpen, setMobileProfileStatus, setMobileNotificationStatus, setMobileNavStatus }) => () => {
            setMobileProfileStatus(!mobileProfileIsOpen);
            setMobileNavStatus(false);
            setMobileNotificationStatus(false);
        },
        closeMobileProfile: ({ setMobileProfileStatus }) => () => {
            setMobileProfileStatus(false);
        }
    }),
    pure
);

export default NavigationHOC(Navigation);