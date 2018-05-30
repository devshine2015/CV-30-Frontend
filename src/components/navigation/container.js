import Navigation from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import styles from './style';

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
    withStyles(styles),
    withState('profileMenuOpen', 'setProfileMenuStatus', false),
    withState('notificationsMenuOpen', 'setNotificationsMenuStatus', false),
    withState('mobileNavOpen', 'setMobileNavStatus', false),
    withState('notifications', 'setNotifications', notifications),
    withHandlers({
        toggleProfileMenu: ({ profileMenuOpen, setProfileMenuStatus }) => () => {
            setProfileMenuStatus(!profileMenuOpen);
        },
        closeProfileMenu: ({ setProfileMenuStatus }) => () => {
            setProfileMenuStatus(false);
        },
        toggleNotificationsMenu: ({ notificationsMenuOpen, setNotificationsMenuStatus }) => () => {
            setNotificationsMenuStatus(!notificationsMenuOpen);
        },
        closeNotificationsMenu: ({ setNotificationsMenuStatus }) => () => {
            setNotificationsMenuStatus(false);
        },
        toggleMobileNav: ({ mobileNavOpen, setMobileNavStatus }) => () => {
            setMobileNavStatus(!mobileNavOpen);
        },
        closeMobileNav: ({ setMobileNavStatus }) => () => {
            setMobileNavStatus(false);
        }
    }),
    pure
);

export default NavigationHOC(Navigation);