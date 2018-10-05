import React from 'react';
import { FormGroup, FormLabel, Switch } from '@material-ui/core';
import { compose, withHandlers, pure } from 'recompose';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { setEditMode, getEditMode } from '../store/queries';


const EditToggle = ({ switchEditMode, getEditMode: { editMode: { status } = { status: false } } }) => (
    <FormGroup row className='editToggle'>
        <FormattedMessage id="toggle.view" defaultMessage="View" description="View">
            {(text) => (
                <FormLabel className={!status ? 'active' : ''}>{text}</FormLabel>
            )}
        </FormattedMessage>
        
        <Switch checked={status} onChange={switchEditMode}
            classes={{
                switchBase: 'colorSwitchBase',
                checked: 'colorChecked',
                bar: 'colorBar',
            }}
            color="primary" />
        <FormattedMessage id="toggle.edit" defaultMessage="Edit" description="Edit">
            {(text) => (
                <FormLabel className={status ? 'active' : ''}>{text}</FormLabel>
            )}
        </FormattedMessage>
        
    </FormGroup>
);

const EditToggleHOC = compose(
    graphql(getEditMode, { name: 'getEditMode' }),
    graphql(setEditMode, { name: 'setEditMode' }),
    withHandlers({
        switchEditMode: ({ setEditMode, getEditMode: { editMode: { status } } }) => async () => {
            try {
                await setEditMode({
                    variables: {
                        status: !status
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    }),
    pure
)

export default EditToggleHOC(EditToggle);