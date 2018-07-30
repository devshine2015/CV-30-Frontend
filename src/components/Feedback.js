import React from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close, CheckCircle, Error, Info, Warning } from '@material-ui/icons';
import { compose, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';

import { getFeedbackMessage, resetFeedbackMessage } from '../store/queries';

const FeedbackHOC = compose(
    graphql(getFeedbackMessage, { name: 'getFeedbackMessage' }),
    graphql(resetFeedbackMessage, { name: 'resetFeedbackMessage' }),
    withHandlers({
        handleClose: ({ resetFeedbackMessage }) => async () => {
            try {
                await resetFeedbackMessage();
            }
            catch (err) {
                console.log(err);
            }
        }
    }),
    pure
);

const Feedback = ({ handleClose, getFeedbackMessage: { feedbackMessage: { status, message } } }) => (
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        open={!!message}
        autoHideDuration={3000}
        onClose={handleClose}
        ContentProps={{
            className: `feedbackRoot ${status}`
        }}
        message={(
            <span className={`messageRoot ${status}`}>
                {(status === 'success') && <CheckCircle className='icon' />}
                {(status === 'error') && <Error className='icon' />}
                {(status === 'info') && <Info className='icon' />}
                {(status === 'warning') && <Warning className='icon' />}
                {message}
            </span>
        )}
        action={
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className='feedbackCloseBtn'
                onClick={handleClose}
            >
                <Close />
            </IconButton>}
    />
);

export default FeedbackHOC(Feedback);