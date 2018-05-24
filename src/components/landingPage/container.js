import { compose, pure, withState, withHandlers } from 'recompose';
import { withStyles } from '@material-ui/core';
import LandingPage from './component';
import styles from './style';


const LandingPageHOC = compose(
    withStyles(styles),
    pure
)

export default LandingPageHOC(LandingPage);