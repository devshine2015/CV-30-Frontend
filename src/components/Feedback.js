import React from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close, CheckCircle, Error, Info, Warning } from '@material-ui/icons';
import { compose, pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
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

const Feedback = ({ handleClose, getFeedbackMessage: { feedbackMessage } }) => {
    if (!feedbackMessage) return null;
    const { status, message } = feedbackMessage;
    return (
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
                <FormattedMessage id="feed.close" defaultMessage="Close" description="Close">
                    {(text) => (
                        <IconButton
                            key="close"
                            aria-label={text}
                            color="inherit"
                            className='feedbackCloseBtn'
                            onClick={handleClose}
                        >
                            <Close />
                        </IconButton>
                    )}
                </FormattedMessage>
                }
        />
    );
};

export default FeedbackHOC(Feedback);