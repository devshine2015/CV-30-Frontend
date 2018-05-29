import Navigation from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import styles from './style';

const NavigationHOC = compose(

    withStyles(styles),
    withState('anchorElement', 'setAnchorElement', null),
    withHandlers({
        handleOpenProfileMenu: ({ setAnchorElement }) => (event) => {
            debugger;
            setAnchorElement(event.target);
        },
        handleCloseProfileMenu: ({ setAnchorElement }) => () => {
            setAnchorElement(null);
        }
    }),
    pure
);

export default NavigationHOC(Navigation);