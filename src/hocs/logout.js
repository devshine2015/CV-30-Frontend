import { compose, pure, withHandlers } from "recompose";
import { graphql, withApollo } from "react-apollo";

import { LogoutMutation } from "../store/queries";

export default compose(
    withApollo,
    graphql(LogoutMutation, {
        name: 'logout'
    }),
    withHandlers({
        doLogout: ({ logout, client, history }) => async () => {
            await logout();
            client.resetStore();
            history.push("/");
        }
    }),
    pure
);