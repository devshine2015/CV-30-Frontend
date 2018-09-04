import React from 'react';
import { Grid, Paper, TextField, Hidden } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { compose, pure, lifecycle, withState } from 'recompose';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { ActivateAccountMutation } from '../../store/queries';

const Activate = (props) => {
    const { error, match } = props;
    const activationCode = match.params.activationCode;
    return (
        <div id="login" className="authContainer">
            <Grid container className='authContents'>
                <Hidden mdDown>
                    <Grid item lg={4} className='authMessages'>
                        <FormattedMessage id="login.title" defaultMessage="Log in" description="Log in">
                            {(text) => (<h1>{text}</h1>)}
                        </FormattedMessage>
                        <FormattedMessage id="login.text" defaultMessage="Log in text" description="Log in text">
                            {(text) => (<p>{text}</p>)}
                        </FormattedMessage>
                    </Grid>
                </Hidden>
                <Grid item lg={4} md={8} sm={12} xs={12} className='authFormContainer'>
                    <Paper className='authForm'>
                        <TextField
                            label="Activation Code"
                            className='textField'
                            type="text"
                            disabled
                            value={activationCode}
                            error={!!error}
                            helperText={error ? error : 'Account successfully activated.'}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
};

const ActivateHOC = compose(
    withRouter,
    withState('error', 'setError', ""),
    graphql(ActivateAccountMutation, {
        name: 'activateAccount'
    }),
    lifecycle({
        componentDidMount() {
            const { match, setError, activateAccount, history } = this.props;
            activateAccount({
                variables: {
                    token: match.params.activationCode
                }
            })
                .then(({ data }) => {
                    const { error, status } = data.activateAccount;
                    if (error) {
                        setError(error);
                    } else if (!status) {
                        setError('Unknown error')
                    } else if (!error && status) {
                        setError(null);
                        history.push({
                            pathname: `/${match.params.lang}/login`,
                            state: { activationSuccess: true }
                        })
                    }
                })
                .catch(error => setError(error.message || error || 'Something went wrong'));

        }
    }),
    pure
);
export default ActivateHOC(Activate);