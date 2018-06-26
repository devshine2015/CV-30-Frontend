import Team from './component';
import { compose, pure, withState, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

const TeamHOC = compose(
    withRouter,
    pure
);
export default TeamHOC(Team);
