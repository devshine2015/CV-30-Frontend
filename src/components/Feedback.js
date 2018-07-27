import React from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import { Close, CheckCircle, Error, Info, Warning } from '@material-ui/icons';

const Feedback = ({ handleClose, message, type }) => (
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        open={!!message}
        autoHideDuration={3000}
        onClose={handleClose}
        ContentProps={{
            className: `feedbackRoot ${type}`
        }}
        message={(
            <span className={`messageRoot ${type}`}>
                {(type === 'success') && <CheckCircle className='icon' />}
                {(type === 'error') && <Error className='icon' />}
                {(type === 'info') && <Info className='icon' />}
                {(type === 'warning') && <Warning className='icon' />}
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

export default Feedback;