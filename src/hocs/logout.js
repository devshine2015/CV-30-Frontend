import { compose, pure, withHandlers } from "recompose";
import { graphql, withApollo } from "react-apollo";

import { LogoutMutation } from "../store/queries";

export default compose(
    withApollo,
    graphql(LogoutMutation, {
        name: 'logout'
    }),
    withHandlers({
        doLogout: (props) => async () => {
            console.log(props);
            const { logout, client } = props;
            await logout();
            client.resetStore();
        }
    }),
    pure
);